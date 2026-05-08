import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Save, X, Edit2, Trash2, Eye, Plus } from 'lucide-react';
import { api } from '../../services/api';

const ExerciseManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newExercise, setNewExercise] = useState({
    title: '',
    description: '',
    dueDate: '',
    starterCode: '',
    solution: '',
    classId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load teacher's classes
      const teacherClasses = await api.getTeacherClasses(user?.id || 1);
      setClasses(teacherClasses);

      // Load all exercises from all classes
      const allExercises = [];
      for (const cls of teacherClasses) {
        const classExercises = await api.getClassExercises(cls.id);
        classExercises.forEach(ex => {
          allExercises.push({
            ...ex,
            className: cls.name,
            classId: cls.id
          });
        });
      }
      setExercises(allExercises);
    } catch (error) {
      console.log('Could not load data');
    }
    setLoading(false);
  };

  const handleCreateExercise = async () => {
    if (!newExercise.title.trim() || !newExercise.dueDate || !newExercise.classId) {
      alert('Title, Due Date, and Class are required');
      return;
    }

    try {
      await api.createExercise({
        class_id: parseInt(newExercise.classId),
        title: newExercise.title,
        description: newExercise.description,
        due_date: newExercise.dueDate,
        starter_code: newExercise.starterCode,
        solution: newExercise.solution,
        teacher_id: user?.id || 1
      });
      await loadData();
      setShowForm(false);
      setNewExercise({ title: '', description: '', dueDate: '', starterCode: '', solution: '', classId: '' });
      alert('Exercise created successfully!');
    } catch (error) {
      alert('Failed to create exercise');
    }
  };

  const handleUpdateExercise = async () => {
    if (!newExercise.title.trim() || !newExercise.dueDate) {
      alert('Title and Due Date are required');
      return;
    }

    try {
      await api.updateExercise(editingExercise.id, {
        class_id: parseInt(newExercise.classId || editingExercise.classId),
        title: newExercise.title,
        description: newExercise.description,
        due_date: newExercise.dueDate,
        starter_code: newExercise.starterCode,
        solution: newExercise.solution
      });
      await loadData();
      setShowForm(false);
      setEditingExercise(null);
      setNewExercise({ title: '', description: '', dueDate: '', starterCode: '', solution: '', classId: '' });
      alert('Exercise updated successfully!');
    } catch (error) {
      alert('Failed to update exercise');
    }
  };

  const handleDeleteExercise = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) {
      try {
        await api.deleteExercise(id);
        setExercises(exercises.filter(ex => ex.id !== id));
        alert('Exercise deleted successfully!');
      } catch (error) {
        alert('Failed to delete exercise');
      }
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setNewExercise({
      title: exercise.title,
      description: exercise.description || '',
      dueDate: exercise.due_date || '',
      starterCode: exercise.starter_code || '',
      solution: exercise.solution || '',
      classId: exercise.classId?.toString() || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExercise(null);
    setNewExercise({ title: '', description: '', dueDate: '', starterCode: '', solution: '', classId: '' });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading exercises...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Exercise Manager</h1>
          <p style={{ color: '#6b7280' }}>Create and manage coding exercises for your classes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> New Exercise
        </button>
      </div>

      {/* Exercise List */}
      {exercises.length > 0 ? (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Class</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Due Date</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map(exercise => (
                  <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{exercise.title}</td>
                    <td style={{ padding: '0.75rem' }}>{exercise.className || 'Unknown'}</td>
                    <td style={{ padding: '0.75rem' }}>{exercise.due_date || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => navigate(`/teacher/submissions/${exercise.id}`)}
                          className="btn-secondary"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          title="View Submissions">
                          <Eye size={14} /> View
                        </button>
                        
                        <button onClick={() => handleEditExercise(exercise)} style={{
                          background: '#f59e0b', color: 'white', border: 'none', padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem',
                          display: 'flex', alignItems: 'center', gap: '0.25rem'
                        }} title="Edit Exercise">
                          <Edit2 size={14} /> Edit
                        </button>
                        
                        <button onClick={() => handleDeleteExercise(exercise.id)} style={{
                          background: '#ef4444', color: 'white', border: 'none', padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem',
                          display: 'flex', alignItems: 'center', gap: '0.25rem'
                        }} title="Delete Exercise">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1rem' }}>
            No exercises created yet
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Create Your First Exercise
          </button>
        </div>
      )}

      {/* Create/Edit Exercise Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="card" style={{ width: '600px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {editingExercise ? 'Edit Exercise' : 'Create New Exercise'}
              </h2>
              <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Class *</label>
                <select value={newExercise.classId}
                  onChange={(e) => setNewExercise({ ...newExercise, classId: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}>
                  <option value="">Select a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title *</label>
                <input type="text" value={newExercise.title}
                  onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  placeholder="e.g., Find Maximum Number" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description *</label>
                <textarea value={newExercise.description}
                  onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', minHeight: '100px' }}
                  placeholder="Describe what students need to do..." />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Due Date *</label>
                <input type="date" value={newExercise.dueDate}
                  onChange={(e) => setNewExercise({ ...newExercise, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Starter Code (Optional)</label>
                <textarea value={newExercise.starterCode}
                  onChange={(e) => setNewExercise({ ...newExercise, starterCode: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #d1d5db', borderRadius: '0.375rem', minHeight: '150px' }}
                  placeholder="function findMax(numbers):\n    # Write your code here\n    return max" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expected Solution (Optional)</label>
                <textarea value={newExercise.solution}
                  onChange={(e) => setNewExercise({ ...newExercise, solution: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', border: '1px solid #d1d5db', borderRadius: '0.375rem', minHeight: '150px' }}
                  placeholder="function findMax(numbers):\n    max = numbers[0]\n    for each num in numbers:\n        if num > max:\n            max = num\n    return max" />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                <button onClick={editingExercise ? handleUpdateExercise : handleCreateExercise}
                  className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={20} />
                  {editingExercise ? 'Update Exercise' : 'Create Exercise'}
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