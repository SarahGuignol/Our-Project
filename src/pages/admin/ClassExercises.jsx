import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, CheckCircle, Clock, Circle } from 'lucide-react';

const ClassExercises = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    loadClassAndExercises();
  }, [classId]);

  const loadClassAndExercises = () => {
    // Load class data from teacherClasses (same source as teacher)
    const savedClasses = localStorage.getItem('teacherClasses');
    if (savedClasses) {
      const classes = JSON.parse(savedClasses);
      const found = classes.find(c => c.id === parseInt(classId) || c.id === classId);
      if (found) {
        setClassData(found);
        
        // Load REAL exercises for this class - DO NOT CREATE MOCK EXERCISES
        const savedExercises = localStorage.getItem(`exercises_${classId}`);
        if (savedExercises) {
          const realExercises = JSON.parse(savedExercises);
          // Add mock stats for display (since we don't have real submissions yet)
          const exercisesWithStats = realExercises.map(ex => ({
            ...ex,
            submissions: ex.submissions || 0,
            totalStudents: found.students || 0,
            avgGrade: ex.avgGrade || 0,
            status: 'active'
          }));
          setExercises(exercisesWithStats);
        } else {
          // Empty array - no mock exercises!
          setExercises([]);
        }
      }
    } else {
      // If no classes at all, show empty
      setExercises([]);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={16} color="#10b981" />;
      case 'pending': return <Clock size={16} color="#f59e0b" />;
      default: return <Circle size={16} color="#9ca3af" />;
    }
  };

  if (!classData) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/admin/classes')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowLeft size={20} /> Back to Classes
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{classData.name}</h1>
        <p style={{ color: '#6b7280' }}>
          Teacher: {classData.teacher || 'Unknown'} • {classData.students || 0} students enrolled
        </p>
      </div>

      {/* Exercises List */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Exercises</h2>
        
        {exercises.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Exercise</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Due Date</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submissions</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Avg Grade</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map(exercise => (
                  <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{exercise.title}</td>
                    <td style={{ padding: '0.75rem', color: '#6b7280' }}>{exercise.dueDate}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {exercise.submissions || 0}/{exercise.totalStudents || classData.students || 0}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{exercise.avgGrade || 0}%</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {getStatusIcon(exercise.status || 'active')}
                        <span style={{ fontSize: '0.875rem' }}>Active</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => navigate(`/admin/classes/${classId}/exercises/${exercise.id}`)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Eye size={14} /> View Exercise
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              No exercises in this class yet
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              The teacher hasn't created any exercises for this class.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassExercises;