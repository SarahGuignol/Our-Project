import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Star } from 'lucide-react';

const SubmissionsReview = () => {
  const { exerciseId } = useParams();
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', code: 'function findMax(numbers):\n    max = numbers[0]\n    for num in numbers:\n        if num > max:\n            max = num\n    return max', aiFeedback: 'Good approach! Consider edge cases like empty array.', comment: '', grade: null },
    { id: 2, name: 'Jane Smith', code: 'function findMax(numbers):\n    return max(numbers)  # Using built-in', aiFeedback: 'This uses a built-in function. Try implementing the logic yourself.', comment: '', grade: null },
  ]);
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [comment, setComment] = useState('');
  const [grade, setGrade] = useState('');

  const handleSaveFeedback = () => {
    const updatedStudents = students.map(s =>
      s.id === selectedStudent.id ? { ...s, comment, grade: grade ? parseInt(grade) : null } : s
    );
    setStudents(updatedStudents);
    setSelectedStudent({ ...selectedStudent, comment, grade: grade ? parseInt(grade) : null });
    alert('Feedback saved successfully!');
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Review Submissions - Exercise #{exerciseId}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', height: 'calc(100% - 60px)' }}>
        {/* Student List */}
        <div className="card" style={{ overflow: 'auto' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Students</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {students.map(student => (
              <button
                key={student.id}
                onClick={() => {
                  setSelectedStudent(student);
                  setComment(student.comment || '');
                  setGrade(student.grade ? student.grade.toString() : '');
                }}
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  background: selectedStudent.id === student.id ? '#eff6ff' : 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: '500' }}>{student.name}</div>
                {student.grade && <div style={{ fontSize: '0.875rem', color: '#10b981' }}>Grade: {student.grade}%</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Submission Details */}
        <div className="card" style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>{selectedStudent.name}'s Submission</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Pseudo-code:</h4>
            <pre style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}>
              {selectedStudent.code}
            </pre>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>AI-generated Feedback:</h4>
            <div style={{
              background: '#f3f4f6',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              borderLeft: '4px solid #3b82f6',
            }}>
              {selectedStudent.aiFeedback}
            </div>
          </div>

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
                fontFamily: 'inherit',
              }}
              placeholder="Add your personal feedback here..."
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
                borderRadius: '0.5rem',
              }}
              min="0"
              max="100"
            />
          </div>

          <button
            onClick={handleSaveFeedback}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Send size={18} /> Save Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsReview;