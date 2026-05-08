import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, Code, Calendar, X, Save } from 'lucide-react';
import { api } from '../../services/api';

const TClassExercises = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '', starterCode: '', solution: ''
  });

  useEffect(() => {
    loadData();
  }, [classId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const classes = await api.getClasses();
      const found = classes.find(c => c.id === parseInt(classId));
      if (found) setClassData(found);

      const ex = await api.getClassExercises(parseInt(classId));
      setExercises(ex || []);
    } catch (error) {
      console.log('Could not load data');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.dueDate) {
      alert('Title and Due Date are required');
      return;
    }

    try {
      await api.createExercise({
        class_id: parseInt(classId),
        title: formData.title,
        description: formData.description,
        due_date: formData.dueDate,
        starter_code: formData.starterCode,
        solution: formData.solution
      });
      await loadData();
      setShowModal(false);
      setFormData({ title: '', description: '', dueDate: '', starterCode: '', solution: '' });
    } catch (error) {
      alert('Failed to create exercise');
    }
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !formData.dueDate) {
      alert('Title and Due Date are required');
      return;
    }

    try {
      await api.updateExercise(editingExercise.id, {
        title: formData.title,
        description: formData.description,
        due_date: formData.dueDate,
        starter_code: formData.starterCode,
        solution: formData.solution
      });
      await loadData();
      setShowModal(false);
      setEditingExercise(null);
      setFormData({ title: '', description: '', dueDate: '', starterCode: '', solution: '' });
      alert('Exercise updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update exercise');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this exercise?')) {
      try {
        await api.deleteExercise(id);
        setExercises(exercises.filter(ex => ex.id !== id));
      } catch (error) {
        alert('Failed to delete exercise');
      }
    }
  };

  const handleEdit = async (exercise) => {
    setEditingExercise(exercise);
    
    // Récupérer les détails complets depuis l'API
    try {
      const fullExercise = await api.getExercise(exercise.id);
      setFormData({
        title: fullExercise.title || '',
        description: fullExercise.description || '',
        dueDate: fullExercise.due_date ? fullExercise.due_date.split('T')[0] : '',
        starterCode: fullExercise.starter_code || '',
        solution: fullExercise.solution_code || ''
      });
    } catch (error) {
      console.error('Error loading exercise details:', error);
      setFormData({
        title: exercise.title || '',
        description: exercise.description || '',
        dueDate: exercise.due_date ? exercise.due_date.split('T')[0] : '',
        starterCode: exercise.starter_code || '',
        solution: exercise.solution_code || ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExercise(null);
    setFormData({ title: '', description: '', dueDate: '', starterCode: '', solution: '' });
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}><p>Loading...</p></div>;
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/teacher/classes')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem',
          borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <ArrowLeft size={20} /> Back to Classes
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{classData?.name}</h1>
          <p style={{ color: '#6b7280' }}>Manage exercises for this class</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Create Exercise
        </button>
      </div>

      {exercises.length > 0 ? (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Due Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map(exercise => (
                <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{exercise.title}</td>
                  <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> {exercise.due_date}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => navigate(`/teacher/submissions/${exercise.id}`)} style={{
                        background: '#3b82f6', color: 'white', border: 'none', padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem',
                        display: 'flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        <Eye size={14} /> View
                      </button>
                      <button onClick={() => handleEdit(exercise)} style={{
                        background: '#f59e0b', color: 'white', border: 'none', padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem',
                        display: 'flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(exercise.id)} style={{
                        background: '#ef4444', color: 'white', border: 'none', padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem',
                        display: 'flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Code size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1rem' }}>
            No exercises in this class yet
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Create Your First Exercise
          </button>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '700px', maxWidth: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {editingExercise ? 'Edit Exercise' : 'Create New Exercise'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title *</label>
                <input type="text" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  placeholder="e.g., Find Maximum Number" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description *</label>
                <textarea value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', minHeight: '80px' }}
                  placeholder="Describe the exercise..." />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Due Date *</label>
                <input type="date" value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Starter Code</label>
                <textarea value={formData.starterCode}
                  onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', minHeight: '150px', fontFamily: 'monospace', fontSize: '0.875rem' }}
                  placeholder="function example():\n    # Write starter code here" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expected Solution</label>
                <textarea value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', minHeight: '150px', fontFamily: 'monospace', fontSize: '0.875rem' }}
                  placeholder="function example():\n    # Write solution here" />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={closeModal} className="btn-secondary">Cancel</button>
                <button onClick={editingExercise ? handleUpdate : handleCreate} className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={16} /> {editingExercise ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TClassExercises;