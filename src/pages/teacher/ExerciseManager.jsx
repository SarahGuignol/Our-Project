import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';

const ExerciseManager = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([
    { id: 1, title: 'Find Maximum Number', dueDate: '2024-01-20', submissions: 20 },
    { id: 2, title: 'Calculate Factorial', dueDate: '2024-01-25', submissions: 18 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    title: '',
    description: '',
    dueDate: '',
    starterCode: '',
    solution: '',
  });

  const handleCreateExercise = () => {
    const exercise = {
      id: exercises.length + 1,
      ...newExercise,
      submissions: 0,
    };
    setExercises([...exercises, exercise]);
    setShowForm(false);
    setNewExercise({ title: '', description: '', dueDate: '', starterCode: '', solution: '' });
    alert('Exercise created successfully!');
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Exercise Manager</h1>
          <p style={{ color: '#6b7280' }}>Create and manage coding exercises</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          + New Exercise
        </button>
      </div>

      {/* Exercise List */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>All Exercises</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Due Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submissions</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map(exercise => (
                <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem' }}>{exercise.title}</td>
                  <td style={{ padding: '0.75rem' }}>{exercise.dueDate}</td>
                  <td style={{ padding: '0.75rem' }}>{exercise.submissions}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      onClick={() => navigate(`/teacher/submissions/${exercise.id}`)}
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                    >
                      View Submissions
                    </button>
                  </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Exercise Modal */}
      {showForm && (
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
          zIndex: 1000,
        }}>
          <div className="card" style={{ width: '600px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Create New Exercise</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title *</label>
                <input
                  type="text"
                  value={newExercise.title}
                  onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  placeholder="e.g., Find Maximum Number"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description *</label>
                <textarea
                  value={newExercise.description}
                  onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', minHeight: '100px' }}
                  placeholder="Describe what students need to do..."
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Due Date *</label>
                <input
                  type="date"
                  value={newExercise.dueDate}
                  onChange={(e) => setNewExercise({ ...newExercise, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Starter Code (Optional)</label>
                <textarea
                  value={newExercise.starterCode}
                  onChange={(e) => setNewExercise({ ...newExercise, starterCode: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #d1d5db', borderRadius: '0.375rem', minHeight: '150px' }}
                  placeholder="function findMax(numbers):\n    # Write your code here\n    return max"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expected Solution (Optional)</label>
                <textarea
                  value={newExercise.solution}
                  onChange={(e) => setNewExercise({ ...newExercise, solution: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #d1d5db', borderRadius: '0.375rem', minHeight: '150px' }}
                  placeholder="function findMax(numbers):\n    max = numbers[0]\n    for each num in numbers:\n        if num > max:\n            max = num\n    return max"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleCreateExercise} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={20} /> Create Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseManager;