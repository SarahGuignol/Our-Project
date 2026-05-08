import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, BookOpen, TrendingUp, Plus, Settings } from 'lucide-react';
import { api } from '../../services/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const teacherClasses = await api.getTeacherClasses(user?.id || 1);
      
      const classesWithDetails = [];
      for (const cls of teacherClasses) {
        // Get exercises for this class
        const exercises = await api.getClassExercises(cls.id);
        
        // Get enrollments to count students
        const enrollments = await api.getEnrollmentsByClass(cls.id);
        const studentsCount = enrollments.length;
        
        // For each exercise, count submissions
        const exercisesWithSubmissions = [];
        for (const ex of (exercises || [])) {
          const submissions = await api.getExerciseSubmissions(ex.id);
          exercisesWithSubmissions.push({
            ...ex,
            submissions: submissions.length,
            averageGrade: submissions.length > 0 
              ? Math.round(submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / submissions.length)
              : 0
          });
        }
        
        classesWithDetails.push({
          ...cls,
          students: enrollments.length,  // Students in THIS class
          enrollments: enrollments,       // Save for unique counting
          exercises: exercisesWithSubmissions
        });
      }
      
      setClasses(classesWithDetails);
    } catch (error) {
      console.log('Could not load dashboard data');
    }
    setLoading(false);
  };

  // Calculate stats dynamically
  // Get unique student IDs across all classes
  const uniqueStudentIds = new Set();
  classes.forEach(cls => {
    cls.enrollments?.forEach(e => uniqueStudentIds.add(e.student_id));
  });
  const totalStudents = uniqueStudentIds.size;
  const totalExercises = classes.reduce((sum, c) => sum + (c.exercises?.length || 0), 0);
  
  let totalSubmissions = 0;
  let totalPossibleSubmissions = 0;
  
  classes.forEach(cls => {
    cls.exercises?.forEach(ex => {
      totalSubmissions += ex.submissions || 0;
      totalPossibleSubmissions += cls.students || 0;
    });
  });
  
  const avgCompletion = totalPossibleSubmissions > 0 
    ? Math.round((totalSubmissions / totalPossibleSubmissions) * 100)
    : 0;

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Teacher Dashboard</h1>
          <p style={{ color: '#6b7280' }}>Manage your classes and track student progress</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/teacher/classes')} className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} /> Manage Classes
          </button>
          <button onClick={() => navigate('/teacher/exercises')} className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Create Exercise
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Users size={24} color="#3b82f6" />
            <h3>Total Students</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalStudents}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BookOpen size={24} color="#10b981" />
            <h3>Total Exercises</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalExercises}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <TrendingUp size={24} color="#f59e0b" />
            <h3>Avg Completion</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{avgCompletion}%</p>
        </div>
      </div>

      {/* Classes */}
      {classes.length > 0 ? (
        classes.map(classItem => (
          <div key={classItem.id} className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{classItem.name}</h2>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {classItem.description || 'No description'}
                </p>
              </div>
              <button onClick={() => navigate(`/teacher/classes/${classItem.id}/exercises`)} className="btn-secondary"
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                Manage Class
              </button>
            </div>
            
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{classItem.students || 0} students enrolled</p>
            
            {classItem.exercises && classItem.exercises.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Exercise</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submissions</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Avg Grade</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classItem.exercises.map(exercise => (
                      <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem' }}>{exercise.title}</td>
                        <td style={{ padding: '0.75rem' }}>{exercise.submissions || 0}/{classItem.students || 0}</td>
                        <td style={{ padding: '0.75rem' }}>{exercise.averageGrade || 0}%</td>
                        <td style={{ padding: '0.75rem' }}>
                          <button onClick={() => navigate(`/teacher/submissions/${exercise.id}`)} className="btn-secondary"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>
                No exercises yet.
                <button onClick={() => navigate(`/teacher/classes/${classItem.id}/exercises`)}
                  style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginLeft: '0.5rem', textDecoration: 'underline' }}>
                  Create your first exercise
                </button>
              </p>
            )}
          </div>
        ))
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <BookOpen size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
            You haven't created any classes yet
          </p>
          <button onClick={() => navigate('/teacher/classes')} className="btn-primary">
            Create Your First Class
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;