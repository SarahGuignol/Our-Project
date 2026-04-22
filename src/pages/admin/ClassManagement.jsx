import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Users, BookOpen } from 'lucide-react';

const ClassManagement = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Load from localStorage or use mock data
    const savedClasses = localStorage.getItem('allClasses');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    } else {
      const mockClasses = [
        { id: 1, name: 'CS101 - Programming Fundamentals', teacher: 'Dr. Smith', teacherId: 't1', students: 25, exercises: 3, status: 'active' },
        { id: 2, name: 'CS201 - Data Structures', teacher: 'Dr. Smith', teacherId: 't1', students: 20, exercises: 3, status: 'active' },
        { id: 3, name: 'CS301 - Algorithms', teacher: 'Dr. Johnson', teacherId: 't2', students: 18, exercises: 2, status: 'active' },
      ];
      setClasses(mockClasses);
      localStorage.setItem('allClasses', JSON.stringify(mockClasses));
    }
  }, []);

  const handleDeleteClass = (id) => {
    if (window.confirm('Delete this class? All associated data will be lost.')) {
      const updated = classes.filter(c => c.id !== id);
      setClasses(updated);
      localStorage.setItem('allClasses', JSON.stringify(updated));
    }
  };

  const handleViewClass = (classId) => {
    navigate(`/admin/classes/${classId}/exercises`);
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Class Management</h1>
          <p style={{ color: '#6b7280' }}>View and manage all classes across the platform</p>
        </div>
      </div>

      {/* Stats */}
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
            <h3>Active Classes</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{classes.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Users size={24} color="#f59e0b" />
            <h3>Total Students</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{classes.reduce((sum, c) => sum + c.students, 0)}</p>
        </div>
      </div>

      {/* Classes Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Class Name</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Teacher</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Students</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Exercises</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem', fontWeight: '500' }}>{cls.name}</td>
                <td style={{ padding: '0.75rem' }}>{cls.teacher}</td>
                <td style={{ padding: '0.75rem' }}>{cls.students}</td>
                <td style={{ padding: '0.75rem' }}>{cls.exercises}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    background: cls.status === 'active' ? '#dcfce7' : '#f3f4f6',
                    color: cls.status === 'active' ? '#166534' : '#6b7280'
                  }}>
                    {cls.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleViewClass(cls.id)}
                      style={{
                        background: '#3b82f6',
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
                      title="View Class"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassManagement;