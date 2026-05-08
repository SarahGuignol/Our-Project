import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Users, BookOpen, Plus, RefreshCw, Edit2 } from 'lucide-react';
import { api } from '../../services/api';

const ClassManagement = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', teacher_id: '' });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger toutes les classes
      const classesData = await api.getClasses();
      setClasses(classesData);
      
      // Charger les professeurs pour le formulaire
      const users = await api.getUsers();
      const teacherList = users.filter(u => u.role === 'teacher');
      setTeachers(teacherList);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert('Class name is required');
      return;
    }

    try {
      await api.createClass({
        teacher_id: parseInt(formData.teacher_id) || 1,
        name: formData.name,
        description: formData.description
      });
      alert('Class created successfully!');
      setShowModal(false);
      setFormData({ name: '', description: '', teacher_id: '' });
      loadData();
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class: ' + error.message);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      alert('Class name is required');
      return;
    }

    try {
      await api.updateClass(editingClass.id, {
        teacher_id: parseInt(formData.teacher_id) || editingClass.teacher_id,
        name: formData.name,
        description: formData.description
      });
      alert('Class updated successfully!');
      setShowModal(false);
      setEditingClass(null);
      setFormData({ name: '', description: '', teacher_id: '' });
      loadData();
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Failed to update class: ' + error.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete class "${name}"? All exercises and student data will be lost.`)) {
      try {
        await api.deleteClass(id);
        alert('Class deleted successfully!');
        loadData();
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Failed to delete class: ' + error.message);
      }
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      description: cls.description || '',
      teacher_id: cls.teacher_id?.toString() || ''
    });
    setShowModal(true);
  };

  const handleViewClass = (classId) => {
    navigate(`/admin/classes/${classId}/exercises`);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({ name: '', description: '', teacher_id: '' });
  };

  // Calculer les statistiques
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0);
  const totalExercises = classes.reduce((sum, cls) => sum + (cls.exercise_count || 0), 0);

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Class Management</h1>
          <p style={{ color: '#6b7280' }}>View and manage all classes across the platform</p>
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

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BookOpen size={24} color="#3b82f6" />
            <h3>Total Classes</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{classes.length}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Users size={24} color="#10b981" />
            <h3>Total Students</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalStudents}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BookOpen size={24} color="#f59e0b" />
            <h3>Total Exercises</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalExercises}</p>
        </div>
      </div>

      {/* Classes Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Class Name</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Teacher</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Students</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Exercises</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Created</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  No classes found
                </td>
              </tr>
            ) : (
              classes.map(cls => (
                <tr key={cls.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{cls.id}</td>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{cls.name}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      background: '#dbeafe',
                      color: '#1e40af'
                    }}>
                      Teacher #{cls.teacher_id}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{cls.student_count || 0}</td>
                  <td style={{ padding: '0.75rem' }}>{cls.exercise_count || 0}</td>
                  <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {cls.created_at ? new Date(cls.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleViewClass(cls.id)}
                        className="btn-secondary"
                        style={{ 
                          padding: '0.25rem 0.75rem', 
                          fontSize: '0.875rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.25rem',
                          background: '#3b82f6',
                          color: 'white'
                        }}
                        title="View Exercises"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id, cls.name)}
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
                        title="Delete"
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

      {/* Modal Create/Edit Class */}
      {showModal && (
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Teacher *</label>
                <select
                  value={formData.teacher_id}
                  onChange={e => setFormData({ ...formData, teacher_id: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                >
                  <option value="">Select a teacher...</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Class Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  placeholder="e.g., CS101 - Programming Fundamentals"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', minHeight: '100px' }}
                  placeholder="Describe your class..."
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={closeModal} className="btn-secondary">Cancel</button>
                <button 
                  onClick={editingClass ? handleUpdate : handleCreate} 
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
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

export default ClassManagement;