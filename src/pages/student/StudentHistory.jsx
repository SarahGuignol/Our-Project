import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, MessageCircle, Award, Code2, Calendar, Eye, Play, Trash2, FileText } from 'lucide-react';

const StudentHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' or 'saved'
  
  // Regular exercise submissions (from classes)
  const [submissions] = useState([
    {
      id: 1,
      exerciseTitle: 'Find Maximum Number',
      className: 'CS101 - Programming Fundamentals',
      submittedAt: '2024-01-15',
      grade: 85,
      teacherComment: 'Good work! Consider handling empty arrays.',
      status: 'graded',
    },
    {
      id: 2,
      exerciseTitle: 'Calculate Factorial',
      className: 'CS101 - Programming Fundamentals',
      submittedAt: '2024-01-10',
      grade: 92,
      teacherComment: 'Excellent optimization!',
      status: 'graded',
    },
    {
      id: 3,
      exerciseTitle: 'Bubble Sort Algorithm',
      className: 'CS201 - Data Structures',
      submittedAt: '2024-01-05',
      grade: null,
      teacherComment: null,
      status: 'pending',
    },
  ]);

  // Saved exercises from Free Mode
  const [savedExercises, setSavedExercises] = useState(() => {
    const saved = localStorage.getItem('freeExercises');
    return saved ? JSON.parse(saved) : [];
  });

  // Refresh saved exercises when tab changes
  useEffect(() => {
    if (activeTab === 'saved') {
      const saved = localStorage.getItem('freeExercises');
      setSavedExercises(saved ? JSON.parse(saved) : []);
    }
  }, [activeTab]);

  const handleDeleteSaved = (id) => {
    if (window.confirm('Delete this saved exercise?')) {
      const updated = savedExercises.filter(ex => ex.id !== id);
      setSavedExercises(updated);
      localStorage.setItem('freeExercises', JSON.stringify(updated));
    }
  };

  const handleLoadExercise = (exercise) => {
    localStorage.setItem('freeModeCode', exercise.code);
    navigate(`/student/coding/free/${exercise.id}`);
  };

  const handleViewExercise = (exercise) => {
    // Show exercise details in a modal or alert
    alert(`📝 ${exercise.title}\n\n📅 Created: ${new Date(exercise.createdAt).toLocaleString()}\n🕐 Last Run: ${new Date(exercise.lastRun).toLocaleString()}\n⚡ Complexity: ${exercise.complexity || 'Not calculated'}\n\n📄 Code:\n${exercise.code.substring(0, 300)}${exercise.code.length > 300 ? '...' : ''}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'submissions' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'submissions' ? '#3b82f6' : '#6b7280',
            fontWeight: activeTab === 'submissions' ? '600' : '400',
            cursor: 'pointer',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FileText size={18} /> Submissions ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'saved' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'saved' ? '#3b82f6' : '#6b7280',
            fontWeight: activeTab === 'saved' ? '600' : '400',
            cursor: 'pointer',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Code2 size={18} /> Saved Exercises ({savedExercises.length})
        </button>
      </div>

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.length > 0 ? (
            submissions.map(submission => (
              <div key={submission.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      {submission.exerciseTitle}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      {submission.className}
                    </p>
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

                {submission.status === 'pending' && (
                  <div style={{
                    background: '#fef3c7',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    display: 'inline-block',
                    marginBottom: submission.teacherComment ? '1rem' : 0
                  }}>
                    <span style={{ color: '#92400e', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> Pending Review
                    </span>
                  </div>
                )}

                {submission.teacherComment && (
                  <div style={{
                    background: '#f3f4f6',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    marginTop: '0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <MessageCircle size={16} color="#3b82f6" />
                      <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>Teacher's Feedback:</span>
                    </div>
                    <p style={{ color: '#374151', fontSize: '0.875rem' }}>{submission.teacherComment}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <FileText size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No submissions yet</p>
              <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Complete exercises from your classes to see them here</p>
            </div>
          )}
        </div>
      )}

      {/* Saved Exercises Tab */}
      {activeTab === 'saved' && (
        <div>
          {savedExercises.length > 0 ? (
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
                          <span>Created: {formatDate(exercise.createdAt)} at {formatTime(exercise.createdAt)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                          <Clock size={14} />
                          <span>Last Run: {formatDate(exercise.lastRun)} at {formatTime(exercise.lastRun)}</span>
                        </div>
                        {exercise.complexity && (
                          <div style={{
                            background: '#eff6ff',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            color: '#3b82f6'
                          }}>
                            {exercise.complexity}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleViewExercise(exercise)}
                        style={{
                          background: 'none',
                          border: '1px solid #d1d5db',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.875rem',
                          color: '#4b5563'
                        }}
                        title="View Details"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleLoadExercise(exercise)}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                        title="Load in Editor"
                      >
                        <Play size={14} /> Load
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(exercise.id)}
                        style={{
                          background: 'none',
                          border: '1px solid #d1d5db',
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          color: '#ef4444'
                        }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Code Preview */}
                  <div style={{
                    background: '#1e1e1e',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    marginTop: '0.5rem'
                  }}>
                    <pre style={{
                      color: '#d4d4d4',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      margin: 0,
                      overflow: 'auto',
                      maxHeight: '100px'
                    }}>
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
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                Go to Free Coding mode, write some code, and run it to save your exercises
              </p>
              <button
                onClick={() => navigate('/student/coding/free')}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Code2 size={18} /> Start Free Coding
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentHistory;