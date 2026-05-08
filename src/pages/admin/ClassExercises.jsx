import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Trash2, Plus, Calendar, Code, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const ClassExercises = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [classId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les détails de la classe
      const classes = await api.getClasses();
      const found = classes.find(c => c.id === parseInt(classId));
      setClassData(found);

      // Charger les exercices de la classe
      const exercisesData = await api.getClassExercises(parseInt(classId));
      
      // Enrichir avec les statistiques de soumissions
      const exercisesWithStats = [];
      for (const ex of exercisesData) {
        const submissions = await api.getExerciseSubmissions(ex.id);
        const gradedSubmissions = submissions.filter(s => s.grade !== null);
        const avgGrade = gradedSubmissions.length > 0
          ? Math.round(gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length)
          : 0;
        
        exercisesWithStats.push({
          ...ex,
          submissions_count: submissions.length,
          average_grade: avgGrade
        });
      }
      
      setExercises(exercisesWithStats);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
    setLoading(false);
  };

  const handleDeleteExercise = async (exerciseId, title) => {
    if (window.confirm(`Delete exercise "${title}"? All submissions will be lost.`)) {
      try {
        await api.deleteExercise(exerciseId);
        alert('Exercise deleted successfully!');
        loadData();
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Failed to delete exercise: ' + error.message);
      }
    }
  };

  const handleViewExercise = (exerciseId) => {
    navigate(`/admin/classes/${classId}/exercises/${exerciseId}`);
  };

  const handleCreateExercise = () => {
    navigate(`/admin/classes/${classId}/exercises/new`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading exercises...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              gap: '0.5rem',
              color: '#3b82f6'
            }}
          >
            <ArrowLeft size={20} /> Back to Classes
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
            onClick={loadData}
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Class Info */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          {classData?.name || 'Class Exercises'}
        </h1>
        <p style={{ color: '#6b7280' }}>
          {classData?.description || 'No description available'}
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <span>📚 {exercises.length} exercises</span>
          <span>👨‍🏫 Teacher #{classData?.teacher_id}</span>
        </div>
      </div>

      {/* Exercises Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Due Date</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submissions</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Average Grade</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Created</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercises.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  <Code size={48} style={{ marginBottom: '1rem' }} />
                  <p>No exercises in this class yet</p>
                  <button 
                    onClick={handleCreateExercise}
                    className="btn-primary"
                    style={{ marginTop: '1rem' }}
                  >
                    Create First Exercise
                  </button>
                </td>
               </tr>
            ) : (
              exercises.map(ex => (
                <tr key={ex.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{ex.id}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{ex.title}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> {formatDate(ex.due_date)}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      background: ex.submissions_count > 0 ? '#dcfce7' : '#f3f4f6',
                      color: ex.submissions_count > 0 ? '#166534' : '#6b7280'
                    }}>
                      {ex.submissions_count || 0}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {ex.average_grade > 0 ? (
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        background: ex.average_grade >= 70 ? '#dcfce7' : ex.average_grade >= 50 ? '#fef3c7' : '#fee2e2',
                        color: ex.average_grade >= 70 ? '#166534' : ex.average_grade >= 50 ? '#92400e' : '#991b1b'
                      }}>
                        {ex.average_grade}%
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {ex.created_at ? formatDate(ex.created_at) : 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleViewExercise(ex.id)}
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
                        title="View Exercise"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(ex.id, ex.title)}
                        style={{
                          background: '#ef4444',
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
                        title="Delete Exercise"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                 </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassExercises;