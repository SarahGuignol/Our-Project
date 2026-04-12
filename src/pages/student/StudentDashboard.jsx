import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Circle, Plus, TrendingUp, Award, Calendar } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [exercises] = useState([
    { id: 1, title: 'Find Maximum Number', dueDate: '2024-01-20', status: 'completed', grade: 85 },
    { id: 2, title: 'Calculate Factorial', dueDate: '2024-01-25', status: 'pending', grade: null },
    { id: 3, title: 'Bubble Sort Algorithm', dueDate: '2024-01-30', status: 'pending', grade: null },
    { id: 4, title: 'Binary Search Implementation', dueDate: '2024-02-05', status: 'not_started', grade: null },
  ]);

  // Statistiques rapides
  const stats = {
    completed: exercises.filter(e => e.status === 'completed').length,
    pending: exercises.filter(e => e.status === 'pending').length,
    averageGrade: 85,
    streak: 15
  };

  const handleStartExercise = (exerciseId, isFreeMode = false) => {
    if (isFreeMode) {
      navigate('/student/coding/free');
    } else {
      navigate(`/student/coding/exercise/${exerciseId}`);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={20} color="#10b981" />;
      case 'pending': return <Clock size={20} color="#f59e0b" />;
      default: return <Circle size={20} color="#9ca3af" />;
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
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome back, Student! 👋</h1>
        <p>Continue your coding journey and master algorithms with AI assistance.</p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
          <BookOpen size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.completed}/{exercises.length}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Exercises Done</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
          <Award size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageGrade}%</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Average Grade</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
          <TrendingUp size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.streak}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Day Streak 🔥</div>
        </div>
      </div>

      {/* Header avec bouton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Your Exercises</h2>
        <button
          onClick={() => handleStartExercise(null, true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> Start New
        </button>
      </div>

      {/* Exercises List */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Due Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Grade</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map(exercise => (
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
      </div>

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