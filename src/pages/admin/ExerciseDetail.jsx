import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Code, Users, Award, Clock, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';

const ExerciseDetail = () => {
  const { classId, exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [className, setClassName] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    loadData();
  }, [classId, exerciseId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les détails de l'exercice
      const exerciseData = await api.getExercise(parseInt(exerciseId));
      setExercise(exerciseData);

      // Charger le nom de la classe
      const classes = await api.getClasses();
      const found = classes.find(c => c.id === parseInt(classId));
      setClassName(found?.name || 'Class');

      // Charger les soumissions
      const submissionsData = await api.getExerciseSubmissions(parseInt(exerciseId));
      
      // Enrichir avec les noms des étudiants
      const submissionsWithNames = [];
      for (const sub of submissionsData) {
        try {
          const student = await api.getUser(sub.student_id);
          submissionsWithNames.push({
            ...sub,
            student_name: student?.name || `Student #${sub.student_id}`
          });
        } catch {
          submissionsWithNames.push({
            ...sub,
            student_name: `Student #${sub.student_id}`
          });
        }
      }
      
      setSubmissions(submissionsWithNames);
    } catch (error) {
      console.error('Error loading exercise:', error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete exercise "${exercise?.title}"? This action cannot be undone.`)) {
      try {
        await api.deleteExercise(parseInt(exerciseId));
        alert('Exercise deleted successfully!');
        navigate(`/admin/classes/${classId}/exercises`);
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Failed to delete exercise: ' + error.message);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/admin/classes/${classId}/exercises/${exerciseId}/edit`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const calculateStats = () => {
    const total = submissions.length;
    const graded = submissions.filter(s => s.grade !== null).length;
    const pending = total - graded;
    const averageGrade = graded > 0
      ? Math.round(submissions.filter(s => s.grade !== null).reduce((sum, s) => sum + s.grade, 0) / graded)
      : 0;
    
    return { total, graded, pending, averageGrade };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading exercise details...</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Exercise not found</p>
        <button onClick={() => navigate(`/admin/classes/${classId}/exercises`)} className="btn-primary">
          Back to Exercises
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate(`/admin/classes/${classId}/exercises`)}
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
            <ArrowLeft size={20} /> Back to Exercises
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleDelete}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      {/* Exercise Info */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {exercise.title}
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              {className} • Exercise #{exercise.id}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Submissions</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageGrade}%</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Average Grade</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
            <Calendar size={18} />
            <span>Due: {formatDate(exercise.due_date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
            <Clock size={18} />
            <span>Created: {formatDate(exercise.created_at)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
            <Users size={18} />
            <span>{stats.pending} pending, {stats.graded} graded</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} /> Description
        </h2>
        <p style={{ color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {exercise.description || 'No description provided.'}
        </p>
      </div>

      {/* Starter Code */}
      {exercise.starter_code && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={20} /> Starter Code
          </h2>
          <pre style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1rem',
            borderRadius: '0.5rem',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            {exercise.starter_code}
          </pre>
        </div>
      )}

      {/* Solution Code (admin only) */}
      {exercise.solution_code && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} /> Expected Solution
          </h2>
          <pre style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1rem',
            borderRadius: '0.5rem',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            {exercise.solution_code}
          </pre>
        </div>
      )}

      {/* Submissions List */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} /> Student Submissions
        </h2>
        
        {submissions.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>
            No submissions yet for this exercise.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Student</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submitted</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Complexity</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Grade</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{sub.student_name}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                      {formatDateTime(sub.submitted_at)}
                    </td>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        background: '#eff6ff',
                        color: '#3b82f6',
                        fontSize: '0.75rem'
                      }}>
                        {sub.time_complexity || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {sub.grade !== null ? (
                        <span style={{
                          fontWeight: 'bold',
                          color: sub.grade >= 70 ? '#10b981' : sub.grade >= 50 ? '#f59e0b' : '#ef4444'
                        }}>
                          {sub.grade}%
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        background: sub.status === 'graded' ? '#dcfce7' : '#fef3c7',
                        color: sub.status === 'graded' ? '#166534' : '#92400e'
                      }}>
                        {sub.status || 'pending'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal pour afficher la soumission détaillée */}
      {selectedSubmission && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setSelectedSubmission(null)}>
          <div className="card" style={{ 
            width: '700px', 
            maxWidth: '90%', 
            maxHeight: '85vh', 
            overflow: 'auto',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Header du modal */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                Submission from {selectedSubmission.student_name}
              </h2>
              <button 
                onClick={() => setSelectedSubmission(null)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1.5rem',
                  color: '#6b7280'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Submission Info */}
            <div style={{ 
              background: '#f3f4f6', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Submitted: {formatDateTime(selectedSubmission.submitted_at)}
              </span>
              <span style={{
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                background: selectedSubmission.status === 'graded' ? '#dcfce7' : '#fef3c7',
                color: selectedSubmission.status === 'graded' ? '#166534' : '#92400e'
              }}>
                {selectedSubmission.status || 'pending'}
              </span>
            </div>
            
            {/* Code */}
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📝 Submitted Code:</h3>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '1rem',
                borderRadius: '0.5rem',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                maxHeight: '200px'
              }}>
                {selectedSubmission.code || 'No code submitted'}
              </pre>
            </div>
            
            {/* Output */}
            {selectedSubmission.output && (
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📤 Output:</h3>
                <pre style={{
                  background: '#f3f4f6',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  maxHeight: '150px',
                  overflow: 'auto'
                }}>
                  {selectedSubmission.output}
                </pre>
              </div>
            )}
            
            {/* Complexity */}
            {selectedSubmission.time_complexity && (
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>⚡ Time Complexity:</h3>
                <span style={{
                  background: '#eff6ff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  color: '#3b82f6',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}>
                  {selectedSubmission.time_complexity}
                </span>
              </div>
            )}
            
            {/* Grade */}
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>🎯 Grade:</h3>
              {selectedSubmission.grade !== null ? (
                <span style={{
                  display: 'inline-block',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  color: selectedSubmission.grade >= 70 ? '#10b981' : selectedSubmission.grade >= 50 ? '#f59e0b' : '#ef4444'
                }}>
                  {selectedSubmission.grade}%
                </span>
              ) : (
                <span style={{ color: '#9ca3af' }}>Not graded yet</span>
              )}
            </div>
            
            {/* Teacher Comment */}
            {selectedSubmission.teacher_comment && (
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>💬 Teacher's Comment:</h3>
                <p style={{
                  background: '#fef3c7',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  color: '#92400e'
                }}>
                  {selectedSubmission.teacher_comment}
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetail;