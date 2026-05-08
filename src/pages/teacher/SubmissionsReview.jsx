import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

const SubmissionsReview = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [comment, setComment] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(true);
  const [exerciseTitle, setExerciseTitle] = useState('');

  useEffect(() => {
    if (exerciseId) {
      loadExerciseInfo();
      loadSubmissions();
    }
  }, [exerciseId]);

  const loadExerciseInfo = async () => {
    try {
      const exercise = await api.getExercise(parseInt(exerciseId));
      if (exercise) {
        setExerciseTitle(exercise.title);
      }
    } catch (error) {
      console.error('Error loading exercise:', error);
    }
  };

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await api.getExerciseSubmissions(parseInt(exerciseId));
      console.log('Submissions loaded:', data);
      setStudents(data);
      if (data.length > 0) {
        setSelectedStudent(data[0]);
        setComment(data[0].teacher_comment || '');
        setGrade(data[0].grade ? data[0].grade.toString() : '');
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
    setLoading(false);
  };

  const handleSaveFeedback = async () => {
    if (!selectedStudent) return;
    
    try {
      await api.gradeSubmission(
        selectedStudent.id,
        grade ? parseInt(grade) : null,
        comment
      );
      alert('Feedback saved successfully!');
      await loadSubmissions();
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback');
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setComment(student.teacher_comment || '');
    setGrade(student.grade ? student.grade.toString() : '');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Header avec bouton retour */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/teacher/analytics')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#3b82f6'
          }}
        >
          <ArrowLeft size={20} /> Back to Analytics
        </button>
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Review Submissions - {exerciseTitle || `Exercise #${exerciseId}`}
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Review and grade student submissions
      </p>
      
      {students.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280' }}>No submissions yet for this exercise.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', minHeight: '500px' }}>
          {/* Student List */}
          <div className="card" style={{ overflow: 'auto' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Students ({students.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {students.map(student => (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: selectedStudent?.id === student.id ? '#eff6ff' : 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '500' }}>{student.student_name || `Student #${student.student_id}`}</div>
                  {student.grade && (
                    <div style={{ fontSize: '0.875rem', color: '#10b981' }}>Grade: {student.grade}%</div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: student.status === 'graded' ? '#10b981' : '#f59e0b' }}>
                    {student.status || 'pending'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submission Details */}
          {selectedStudent && (
            <div className="card" style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                {selectedStudent.student_name || `Student #${selectedStudent.student_id}`}'s Submission
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Submitted Code:</h4>
                <pre style={{
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  maxHeight: '300px'
                }}>
                  {selectedStudent.code || 'No code submitted'}
                </pre>
              </div>

              {selectedStudent.output && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Output:</h4>
                  <pre style={{
                    background: '#f3f4f6',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>
                    {selectedStudent.output}
                  </pre>
                </div>
              )}

              {selectedStudent.time_complexity && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Time Complexity:</h4>
                  <div style={{
                    background: '#eff6ff',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontFamily: 'monospace',
                    color: '#3b82f6'
                  }}>
                    {selectedStudent.time_complexity}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Teacher's Comment:</h4>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    minHeight: '100px',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Add your feedback here..."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Grade (%):</h4>
                <input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  style={{
                    width: '100px',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem'
                  }}
                  min="0"
                  max="100"
                />
              </div>

              <button
                onClick={handleSaveFeedback}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <Send size={18} /> Save Feedback
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmissionsReview;