import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Trash2, Key, X, Save } from 'lucide-react';

const UserManagement = () => {
  const { allUsers, createUser, deleteUser, resetUserPassword } = useAuth();
  const [users, setUsers] = useState(allUsers || []);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student', password: '' });

  const handleCreate = () => {
    if (!newUser.name || !newUser.email) {
      alert('Name and email are required');
      return;
    }
    const created = createUser(newUser);
    setUsers([...users, created]);
    setShowModal(false);
    setNewUser({ name: '', email: '', role: 'student', password: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Permanently delete this user?')) {
      deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>User Management</h1>
          <p style={{ color: '#6b7280' }}>Create, edit, or delete user accounts</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowModal(true)}>
          <Plus size={18} /> New User
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Role</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Joined</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem', fontWeight: '500' }}>{user.name}</td>
                <td style={{ padding: '0.75rem' }}>{user.email}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    background: user.role === 'admin' ? '#f3e8ff' : user.role === 'teacher' ? '#dbeafe' : '#dcfce7',
                    color: user.role === 'admin' ? '#6b21a8' : user.role === 'teacher' ? '#1e40af' : '#166534',
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ color: user.status === 'active' ? '#10b981' : '#9ca3af' }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', color: '#6b7280' }}>{user.joinDate}</td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => resetUserPassword(user.id)}
                      style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', borderRadius: '0.25rem' }}
                      title="Reset Password"
                    >
                      <Key size={16} />
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', borderRadius: '0.25rem', color: '#ef4444' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Create User</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Temporary Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  placeholder="Leave blank for auto-generation"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={handleCreate}>
                  <Save size={16} /> Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;