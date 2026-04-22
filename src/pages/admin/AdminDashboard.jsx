import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, BookOpen, Activity, TrendingUp, AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const { allUsers } = useAuth();
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load users
    const users = JSON.parse(localStorage.getItem('allUsers')) || [];
    const students = users.filter(u => u.role === 'student');
    const teachers = users.filter(u => u.role === 'teacher');
    const admins = users.filter(u => u.role === 'admin');

    // Load classes
    const classes = JSON.parse(localStorage.getItem('teacherClasses')) || [];
    
    // Load all exercises and submissions
    let totalExercises = 0;
    let totalSubmissions = 0;
    const allActivities = [];
    const alerts = [];

    classes.forEach(cls => {
      const savedExercises = localStorage.getItem(`exercises_${cls.id}`);
      if (savedExercises) {
        const exercises = JSON.parse(savedExercises);
        totalExercises += exercises.length;

        exercises.forEach(ex => {
          // Add exercise creation to activity
          if (ex.createdAt) {
            allActivities.push({
              id: `ex-${ex.id}`,
              type: 'exercise',
              user: cls.teacher || 'Teacher',
              action: `created exercise "${ex.title}"`,
              class: cls.name,
              time: ex.createdAt,
              icon: BookOpen
            });
          }

          // Load submissions for this exercise
          const savedSubmissions = localStorage.getItem(`submissions_${ex.id}`);
          if (savedSubmissions) {
            const submissions = JSON.parse(savedSubmissions);
            totalSubmissions += submissions.length;

            submissions.forEach(sub => {
              // Add submission to activity
              if (sub.submittedAt) {
                allActivities.push({
                  id: `sub-${sub.id || Date.now()}`,
                  type: 'submission',
                  user: sub.name,
                  action: `submitted "${ex.title}"`,
                  class: cls.name,
                  time: sub.submittedAt,
                  grade: sub.grade,
                  icon: FileText
                });
              }

              // Check for alerts (low grades)
              if (sub.grade !== null && sub.grade < 50) {
                alerts.push({
                  id: `alert-${sub.id}`,
                  message: `${sub.name} scored ${sub.grade}% on "${ex.title}"`,
                  severity: 'warning'
                });
              }
            });
          }
        });
      }

      // Add class creation to activity
      if (cls.createdAt) {
        allActivities.push({
          id: `cls-${cls.id}`,
          type: 'class',
          user: cls.teacher || 'Teacher',
          action: `created class "${cls.name}"`,
          time: cls.createdAt,
          icon: Users
        });
      }
    });

    // Add user signups to activity
    users.forEach(u => {
      if (u.joinDate) {
        allActivities.push({
          id: `user-${u.id}`,
          type: 'user',
          user: u.name,
          action: `joined as ${u.role}`,
          time: u.joinDate,
          icon: Users
        });
      }
    });

    // Sort activities by time (most recent first)
    allActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Calculate completion rate
    const totalPossibleSubmissions = classes.reduce((sum, cls) => {
      const savedExercises = localStorage.getItem(`exercises_${cls.id}`);
      if (savedExercises) {
        const exercises = JSON.parse(savedExercises);
        return sum + (exercises.length * (cls.students || 0));
      }
      return sum;
    }, 0);

    const avgCompletion = totalPossibleSubmissions > 0
      ? Math.round((totalSubmissions / totalPossibleSubmissions) * 100)
      : 0;

    setStats({
      totalUsers: users.length,
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalAdmins: admins.length,
      totalClasses: classes.length,
      totalExercises: totalExercises,
      totalSubmissions: totalSubmissions,
      avgCompletion: avgCompletion
    });

    // Take 5 most recent activities
    setRecentActivity(allActivities.slice(0, 5));
    setSystemAlerts(alerts.slice(0, 3));
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

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
    { label: 'Students', value: stats.totalStudents, icon: Users, color: '#10b981' },
    { label: 'Teachers', value: stats.totalTeachers, icon: Users, color: '#f59e0b' },
    { label: 'Classes', value: stats.totalClasses, icon: BookOpen, color: '#8b5cf6' },
    { label: 'Exercises', value: stats.totalExercises, icon: Activity, color: '#ec4899' },
    { label: 'Completion Rate', value: `${stats.avgCompletion}%`, icon: TrendingUp, color: '#06b6d4' },
  ];

  const getActivityIcon = (activity) => {
    const Icon = activity.icon || Activity;
    return <Icon size={16} />;
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">Platform overview and supervision</p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
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
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} /> Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map(act => (
                <div key={act.id} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#6b7280' }}>{getActivityIcon(act)}</span>
                    <div>
                      <span className="font-medium">{act.user}</span>
                      <span className="text-gray-600"> {act.action}</span>
                      {act.class && (
                        <span className="text-gray-400 text-sm"> in {act.class}</span>
                      )}
                      {act.grade !== undefined && act.grade !== null && (
                        <span className={`ml-2 text-sm ${act.grade >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                          Grade: {act.grade}%
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {formatTimeAgo(act.time)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* System Alerts */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-warning" /> System Alerts
          </h2>
          {systemAlerts.length > 0 ? (
            <ul className="space-y-2">
              {systemAlerts.map(alert => (
                <li key={alert.id} className="text-sm text-gray-700 flex items-start gap-2">
                  <AlertTriangle size={14} color="#f59e0b" style={{ marginTop: '2px' }} />
                  <span>{alert.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2">
              <li className="text-sm text-gray-700 flex items-center gap-2">
                <CheckCircle size={14} color="#10b981" />
                <span>✅ All services operational</span>
              </li>
              <li className="text-sm text-gray-700 flex items-center gap-2">
                <CheckCircle size={14} color="#10b981" />
                <span>✅ No critical alerts</span>
              </li>
            </ul>
          )}
          
          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between py-1">
                <span>Total Submissions:</span>
                <span className="font-semibold">{stats.totalSubmissions}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Administrators:</span>
                <span className="font-semibold">{stats.totalAdmins}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;