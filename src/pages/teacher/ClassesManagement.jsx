import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit2, Trash2, Eye, BookOpen, Users, X, Save } from 'lucide-react';
import { api } from '../../services/api';

const ClassesManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await api.getTeacherClasses(user?.id || 1);
      setClasses(data);
    } catch (error) {
      console.log('Could not load classes');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert('Class name is required');
      return;
    }

    try {
      const result = await api.createClass({
        teacher_id: user?.id || 1,
        name: formData.name,
        description: formData.description
      });

      if (result.success) {
        await loadClasses();
        setShowModal(false);
        setFormData({ name: '', description: '' });
      }
    } catch (error) {
      alert('Failed to create class');
    }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      alert('Class name is required');
      return;
    }

    try {
      await api.updateClass(editingClass.id, {
        teacher_id: user?.id || 1,
        name: formData.name,
        description: formData.description
      });
      await loadClasses();
      setShowModal(false);
      setEditingClass(null);
      setFormData({ name: '', description: '' });
    } catch (error) {
      alert('Failed to update class');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this class? All exercises and student data will be lost.')) {
      try {
        await api.deleteClass(id);
        setClasses(classes.filter(c => c.id !== id));
      } catch (error) {
        alert('Failed to delete class');
      }
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({ name: cls.title || cls.name, description: cls.description || '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage My Classes</h1>
          <p style={{ color: '#6b7280' }}>Create and manage your classes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Create Class
        </button>
      </div>

      {classes.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {classes.map(cls => (
            <div key={cls.id} className="card">
              <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{cls.name}</h2>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {cls.description || 'No description'}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={() => navigate(`/teacher/classes/${cls.id}/exercises`)} style={{
                  flex: 1, background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem',
                  borderRadius: '0.375rem', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.875rem'
                }}>
                  <Eye size={14} /> View Exercises
                </button>
                <button onClick={() => handleEdit(cls)} style={{
                  background: '#f59e0b', color: 'white', border: 'none', padding: '0.5rem',
                  borderRadius: '0.375rem', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.875rem'
                }}>
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(cls.id)} style={{
                  background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem',
                  borderRadius: '0.375rem', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.875rem'
                }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <BookOpen size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '1rem' }}>
            You haven't created any classes yet
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Create Your First Class
          </button>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {editingClass ? 'Edit Class' : 'Create New Class'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Class Name *</label>
                <input type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  placeholder="e.g., CS101 - Programming Fundamentals" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                <textarea value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', minHeight: '100px' }}
                  placeholder="Describe your class..." />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={closeModal} className="btn-secondary">Cancel</button>
                <button onClick={editingClass ? handleUpdate : handleCreate} className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={16} /> {editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesManagement;