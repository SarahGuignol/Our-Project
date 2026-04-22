import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Clock, CheckCircle, Circle, Plus, TrendingUp, Award, Users, Search } from 'lucide-react';
import { getEnrolledClasses, calculateStudentStats, initializeMockData } from '../../data/mockData';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    initializeMockData();
  }, []);

  // Force refresh when returning from browse page
  useEffect(() => {
    const handleFocus = () => setRefresh(prev => prev + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const enrolledClasses = getEnrolledClasses();

  const allExercises = useMemo(() => {
    return enrolledClasses.flatMap(cls => cls.exercises || []);
  }, [enrolledClasses, refresh]);

  const stats = useMemo(() => {
    return calculateStudentStats(user);
  }, [enrolledClasses, user, refresh]);

  const handleStartExercise = (exerciseId, isFreeMode = false) => {
    if (isFreeMode) {
      navigate('/student/coding/free');
    } else {
      navigate(`/student/coding/exercise/${exerciseId}`);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={16} color="#10b981" />;
      case 'pending': return <Clock size={16} color="#f59e0b" />;
      default: return <Circle size={16} color="#9ca3af" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending Review';
      default: return 'Not Started';
    }
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 50%, #2563eb 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Welcome back, <span>{user?.name || 'Student'}</span> 👋
        </h1>
        <p>Continue your coding journey and master algorithms with AI assistance.</p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Users size={24} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.enrolledClasses}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Enrolled Classes</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <BookOpen size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.completedExercises}/{stats.totalExercises}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Exercises Done</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <Award size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageGrade}%</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Average Grade</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingUp size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalHours}h</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Hours Coded</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>My Classes</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/student/browse')}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Search size={20} /> Browse Classes
          </button>
          <button
            onClick={() => handleStartExercise(null, true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} /> Free Coding
          </button>
        </div>
      </div>

      {/* Classes and Exercises */}
      {enrolledClasses.length > 0 ? (
        enrolledClasses.map(cls => (
          <div key={cls.id} className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{cls.name}</h2>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <Users size={14} /> Teacher: {cls.teacher}
                </p>
              </div>
              <div style={{
                background: '#eff6ff',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                color: '#3b82f6'
              }}>
                {cls.exercises?.filter(e => e.status === 'completed').length || 0}/{cls.exercises?.length || 0} completed
              </div>
            </div>
            
            {cls.exercises && cls.exercises.length > 0 ? (
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Exercise</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Due Date</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Grade</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.exercises.map(exercise => (
                      <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '0.75rem', fontWeight: '500' }}>{exercise.title}</td>
                        <td style={{ padding: '0.75rem', color: '#6b7280' }}>{exercise.dueDate}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {getStatusIcon(exercise.status)}
                            <span style={{ fontSize: '0.875rem' }}>{getStatusText(exercise.status)}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: '600' }}>
                          {exercise.grade ? `${exercise.grade}%` : '-'}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <button
                            onClick={() => handleStartExercise(exercise.id)}
                            className="btn-primary"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                          >
                            {exercise.status === 'completed' ? 'Review' : 'Start'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>
                No exercises in this class yet.
              </p>
            )}
          </div>
        ))
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <BookOpen size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
            You're not enrolled in any classes yet
          </p>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
            Browse and enroll in classes to get started
          </p>
          <button
            onClick={() => navigate('/student/browse')}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Search size={18} /> Browse Classes
          </button>
        </div>
      )}

      {/* Motivation Quote */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        textAlign: 'center',
        background: '#fef3c7',
        borderRadius: '0.5rem',
        color: '#92400e'
      }}>
        <p>💡 "The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie</p>
      </div>
    </div>
  );
};

export default StudentDashboard;