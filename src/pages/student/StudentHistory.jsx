import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, CheckCircle, MessageCircle, Award, Code2, Calendar, Eye, Play, Trash2, FileText } from 'lucide-react';
import { api } from '../../services/api';

const StudentHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submissions');
  
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await api.getStudentSubmissions(user?.id || 1);
      
      // For each submission, get the exercise title
      const submissionsWithDetails = [];
      for (const sub of data) {
        try {
          const exercise = await api.getExercise(sub.exercise_id);
          submissionsWithDetails.push({
            ...sub,
            exerciseTitle: exercise.title || `Exercise #${sub.exercise_id}`,
          });
        } catch {
          submissionsWithDetails.push({
            ...sub,
            exerciseTitle: `Exercise #${sub.exercise_id}`,
          });
        }
      }
      
      setSubmissions(submissionsWithDetails);
    } catch (error) {
      console.log('Could not load submissions');
    }
  };

  // Saved exercises from API
  const [savedExercises, setSavedExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedExercises();
  }, []);

  const loadSavedExercises = async () => {
    setLoading(true);
    try {
      const data = await api.getFreeExercises(user?.id || 1);
      setSavedExercises(data);
    } catch (error) {
      console.log('Could not load from API');
      setSavedExercises([]);
    }
    setLoading(false);
  };

  const handleDeleteSaved = async (exerciseId) => {
    if (window.confirm('Delete this saved exercise?')) {
      try {
        await api.deleteFreeExercise(exerciseId);
        setSavedExercises(savedExercises.filter(ex => ex.id !== exerciseId));
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const handleLoadExercise = (exercise) => {
    navigate(`/student/coding/free/${exercise.id}`);
  };

  const handleViewExercise = (exercise) => {
    alert(`📝 ${exercise.title}\n\n📅 Created: ${new Date(exercise.created_at).toLocaleString()}\n⚡ Complexity: ${exercise.time_complexity || 'N/A'}\n\n📄 Code:\n${exercise.code.substring(0, 300)}${exercise.code.length > 300 ? '...' : ''}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>History</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>View your past submissions and saved exercises</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
        <button
          onClick={() => setActiveTab('submissions')}
          style={{
            padding: '0.75rem 1.5rem', background: 'none', border: 'none',
            borderBottom: activeTab === 'submissions' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'submissions' ? '#3b82f6' : '#6b7280',
            fontWeight: activeTab === 'submissions' ? '600' : '400',
            cursor: 'pointer', marginBottom: '-2px',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FileText size={18} /> Submissions ({submissions.length})
        </button>
        <button
          onClick={() => { setActiveTab('saved'); loadSavedExercises(); }}
          style={{
            padding: '0.75rem 1.5rem', background: 'none', border: 'none',
            borderBottom: activeTab === 'saved' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'saved' ? '#3b82f6' : '#6b7280',
            fontWeight: activeTab === 'saved' ? '600' : '400',
            cursor: 'pointer', marginBottom: '-2px',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <Code2 size={18} /> Saved Exercises ({savedExercises.length})
        </button>
      </div>

      {/* Saved Exercises Tab */}
      {activeTab === 'saved' && (
        <div>
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#6b7280' }}>Loading exercises from database...</p>
            </div>
          ) : savedExercises.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedExercises.map(exercise => (
                <div key={exercise.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Code2 size={18} color="#3b82f6" />
                        {exercise.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                          <Calendar size={14} />
                          <span>Created: {formatDate(exercise.created_at)}</span>
                        </div>
                        {exercise.time_complexity && (
                          <div style={{
                            background: '#eff6ff', padding: '0.125rem 0.5rem',
                            borderRadius: '9999px', fontSize: '0.75rem', color: '#3b82f6'
                          }}>
                            {exercise.time_complexity}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleViewExercise(exercise)} style={{
                        background: 'none', border: '1px solid #d1d5db', padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#4b5563'
                      }}>
                        <Eye size={14} /> View
                      </button>
                      <button onClick={() => handleLoadExercise(exercise)} style={{
                        background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 0.75rem',
                        borderRadius: '0.375rem', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem'
                      }}>
                        <Play size={14} /> Load
                      </button>
                      <button onClick={() => handleDeleteSaved(exercise.id)} style={{
                        background: 'none', border: '1px solid #d1d5db', padding: '0.5rem',
                        borderRadius: '0.375rem', cursor: 'pointer', color: '#ef4444'
                      }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ background: '#1e1e1e', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
                    <pre style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '0.75rem', margin: 0, overflow: 'auto', maxHeight: '100px' }}>
                      {exercise.code.substring(0, 200)}{exercise.code.length > 200 ? '...' : ''}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Code2 size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                No saved exercises yet
              </p>
              <button onClick={() => navigate('/student/coding/free')} className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={18} /> Start Free Coding
              </button>
            </div>
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.map(submission => (
            <div key={submission.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{submission.exerciseTitle}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{submission.className}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    <Clock size={14} />
                    <span>Submitted: {submission.submittedAt}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} color="#f59e0b" />
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                    {submission.grade ? `${submission.grade}%` : '—'}
                  </span>
                </div>
              </div>
              {submission.teacherComment && (
                <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MessageCircle size={16} color="#3b82f6" />
                    <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>Teacher's Feedback:</span>
                  </div>
                  <p style={{ color: '#374151', fontSize: '0.875rem' }}>{submission.teacherComment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentHistory;