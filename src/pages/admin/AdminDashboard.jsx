import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, BookOpen, Activity, TrendingUp, AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalClasses: 0,
    totalExercises: 0,
    totalSubmissions: 0,
    avgCompletion: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getAlertColor = (severity) => {
    switch(severity) {
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#10b981';
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Utiliser le nouvel endpoint backend
      const data = await api.getAdminDashboard();
      
      console.log("Admin dashboard data:", data);
      
      // Calculer le taux de complétion
      let totalPossibleSubmissions = 0;
      for (const cls of data.classes_list || []) {
        totalPossibleSubmissions += (cls.exercise_count || 0) * (cls.student_count || 0);
      }
      const avgCompletion = totalPossibleSubmissions > 0
        ? Math.round((data.submissions.total / totalPossibleSubmissions) * 100)
        : 0;
      
      setStats({
        totalUsers: data.users.total,
        totalStudents: data.users.students,
        totalTeachers: data.users.teachers,
        totalAdmins: data.users.admins,
        totalClasses: data.classes.total,
        totalExercises: data.exercises.length,
        totalSubmissions: data.submissions.total,
        avgCompletion: data.completion_rate 
      });
      
      // Formater les activités récentes
      const formattedActivities = (data.activities || []).slice(0, 5).map(act => ({
        id: act.id,
        user: act.user,
        action: act.action,
        item: act.item,
        class: act.class,
        time: act.time,
        grade: act.grade,
        type: act.type,
        icon: act.type === 'submission' ? FileText : (act.type === 'exercise' ? BookOpen : Users)
      }));
      
      setRecentActivity(formattedActivities);
      
      // Générer les alertes
      const alerts = [];
      
      if (data.alerts.no_submissions && data.alerts.no_submissions.length > 0) {
        alerts.push({
          id: 'no-submissions',
          message: `📌 ${data.alerts.no_submissions.length} exercise(s) have no submissions yet: ${data.alerts.no_submissions.map(e => e.title).join(', ')}`,
          severity: 'info'
        });
      }
      
      if (data.alerts.classes_without_exercises && data.alerts.classes_without_exercises.length > 0) {
        alerts.push({
          id: 'no-exercises',
          message: `🏫 ${data.alerts.classes_without_exercises.length} class(es) have no exercises`,
          severity: 'warning'
        });
      }
      
      if (data.alerts.pending_submissions && data.alerts.pending_submissions > 0) {
        alerts.push({
          id: 'pending',
          message: `📝 ${data.alerts.pending_submissions} submission(s) pending grading`,
          severity: 'warning'
        });
      }
      
      if (data.alerts.low_grades && data.alerts.low_grades.length > 0) {
        alerts.push({
          id: 'low-grades',
          message: `⚠️ ${data.alerts.low_grades.length} submission(s) with grade below 50%`,
          severity: 'danger'
        });
      }
      
      if (alerts.length === 0) {
        alerts.push({
          id: 'all-good',
          message: '✅ All services operational',
          severity: 'success'
        });
        alerts.push({
          id: 'no-critical',
          message: '✅ No critical alerts',
          severity: 'success'
        });
      }
      
      setSystemAlerts(alerts);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Fallback si l'API admin n'existe pas encore
      loadFallbackData();
    }
    setLoading(false);
  };

  // Fallback si l'API admin n'existe pas
  const loadFallbackData = async () => {
    try {
      const users = await api.getUsers();
      const classes = await api.getClasses();
      
      const students = users.filter(u => u.role === 'student');
      const teachers = users.filter(u => u.role === 'teacher');
      const admins = users.filter(u => u.role === 'admin');
      
      let totalExercises = 0;
      let totalSubmissions = 0;
      let exercisesList = [];
      
      for (const cls of classes) {
        const exercises = await api.getClassExercises(cls.id);
        totalExercises += exercises.length;
        exercisesList.push(...exercises);
        
        for (const ex of exercises) {
          const submissions = await api.getExerciseSubmissions(ex.id);
          totalSubmissions += submissions.length;
        }
      }
      
      // Vérifier les exercices sans soumission
      const exercisesWithoutSubmissions = [];
      for (const ex of exercisesList) {
        const submissions = await api.getExerciseSubmissions(ex.id);
        if (submissions.length === 0) {
          exercisesWithoutSubmissions.push(ex.title);
        }
      }
      
      setStats({
        totalUsers: users.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalAdmins: admins.length,
        totalClasses: classes.length,
        totalExercises: totalExercises,
        totalSubmissions: totalSubmissions,
        avgCompletion: 0
      });
      
      setRecentActivity([]);
      
      const alerts = [];
      if (exercisesWithoutSubmissions.length > 0) {
        alerts.push({
          id: 'no-submissions',
          message: `📌 ${exercisesWithoutSubmissions.length} exercise(s) have no submissions yet: ${exercisesWithoutSubmissions.join(', ')}`,
          severity: 'info'
        });
      } else {
        alerts.push({
          id: 'all-good',
          message: '✅ All services operational',
          severity: 'success'
        });
      }
      
      setSystemAlerts(alerts);
      
    } catch (err) {
      console.error('Fallback error:', err);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (activity) => {
    if (activity.type === 'submission') return <FileText size={16} />;
    if (activity.type === 'exercise') return <BookOpen size={16} />;
    return <Users size={16} />;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Platform overview and supervision</p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#3b82f620', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <Users size={24} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Users</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#10b98120', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <Users size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalStudents}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Students</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#f59e0b20', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <Users size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalTeachers}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Teachers</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#8b5cf620', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <BookOpen size={24} color="#8b5cf6" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalClasses}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Classes</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#ec489920', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <Activity size={24} color="#ec4899" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalExercises}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Exercises</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#06b6d420', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <TrendingUp size={24} color="#06b6d4" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.avgCompletion}%</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Activity */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} /> Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivity.length > 0 ? (
              recentActivity.map(act => (
                <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#6b7280' }}>{getActivityIcon(act)}</span>
                    <div>
                      <span style={{ fontWeight: '500' }}>{act.user}</span>
                      <span style={{ color: '#6b7280' }}> {act.action}</span>
                      {act.item && (
                        <span style={{ fontWeight: '500' }}> "{act.item}"</span>
                      )}
                      {act.class && (
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}> in {act.class}</span>
                      )}
                      {act.grade && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: act.grade >= 70 ? '#10b981' : '#ef4444' }}>
                          Grade: {act.grade}%
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {formatTimeAgo(act.time)}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>No recent activity</p>
            )}
          </div>
        </div>

        {/* System Alerts */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#f59e0b" /> System Alerts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {systemAlerts.map(alert => (
              <div key={alert.id} style={{ 
                fontSize: '0.875rem', 
                color: '#374151', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                backgroundColor: alert.severity === 'danger' ? '#fef2f2' : 
                               alert.severity === 'warning' ? '#fffbeb' : 
                               alert.severity === 'info' ? '#eff6ff' : '#f0fdf4'
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: getAlertColor(alert.severity) 
                }} />
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
          
          {/* Additional Info */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                <span>Total Submissions:</span>
                <span style={{ fontWeight: '600' }}>{stats.totalSubmissions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                <span>Administrators:</span>
                <span style={{ fontWeight: '600' }}>{stats.totalAdmins}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;