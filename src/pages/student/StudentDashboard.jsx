import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Clock, CheckCircle, Circle, Plus, TrendingUp, Award, Users, Search } from 'lucide-react';
import { api } from '../../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [classes, setClasses] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const enrollments = await api.getStudentEnrollments(user?.id || 1);
      const studentSubmissions = await api.getStudentSubmissions(user?.id || 1);
      
      console.log("Enrollments:", enrollments);
      console.log("Submissions:", studentSubmissions);
      
      const classesData = [];
      for (const enrollment of enrollments) {
        const classExercises = await api.getClassExercises(enrollment.class_id);
        
        console.log(`Exercises for class ${enrollment.class_id}:`, classExercises);
        
        const exercisesWithStatus = classExercises.map(ex => {
          // Chercher une soumission pour cet exercice
          const submission = studentSubmissions.find(s => s.exercise_id === ex.id);
          console.log(`Exercise ${ex.id} - Submission:`, submission);
          
          return {
            ...ex,
            status: submission ? (submission.grade !== null ? 'completed' : 'pending') : 'not_started',
            grade: submission?.grade || null
          };
        });
        
        classesData.push({
          id: enrollment.class_id,
          name: enrollment.class_name,
          exercises: exercisesWithStatus
        });
      }
      setClasses(classesData);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  // Calculate stats dynamically
  const completedExercises = classes.flatMap(c => c.exercises || []).filter(e => e.status === 'completed').length;
  const totalExercises = classes.flatMap(c => c.exercises || []).length;
  const gradedExercises = classes.flatMap(c => c.exercises || []).filter(e => e.grade !== null);
  const averageGrade = gradedExercises.length > 0
    ? Math.round(gradedExercises.reduce((sum, e) => sum + e.grade, 0) / gradedExercises.length)
    : 0;

  const handleStartExercise = (exerciseId) => {
    navigate(`/student/coding/exercise/${exerciseId}`);
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

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading your dashboard...</p>
      </div>
    );
  }

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
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{classes.length}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Enrolled Classes</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <BookOpen size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completedExercises}/{totalExercises}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Exercises Done</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <Award size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{averageGrade}%</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Average Grade</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>My Classes</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/student/browse')} className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={20} /> Browse Classes
          </button>
          <button onClick={() => navigate('/student/coding/free')} className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Free Coding
          </button>
        </div>
      </div>

      {/* Classes and Exercises */}
      {classes.length > 0 ? (
        classes.map(cls => (
          <div key={cls.id} className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{cls.name}</h2>
            
            {cls.exercises && cls.exercises.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
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
                      <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem', fontWeight: '500' }}>{exercise.title}</td>
                        <td style={{ padding: '0.75rem', color: '#6b7280' }}>{exercise.due_date || exercise.dueDate || 'N/A'}</td>
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
                          <button onClick={() => handleStartExercise(exercise.id)} className="btn-primary"
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
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
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
            You're not enrolled in any classes yet
          </p>
          <button onClick={() => navigate('/student/browse')} className="btn-primary">
            Browse Classes
          </button>
        </div>
      )}

      <div style={{
        marginTop: '2rem', padding: '1rem', textAlign: 'center',
        background: '#fef3c7', borderRadius: '0.5rem', color: '#92400e'
      }}>
        <p>💡 "The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie</p>
      </div>
    </div>
  );
};

export default StudentDashboard;