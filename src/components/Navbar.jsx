import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code2, LogOut, User, Home, BookOpen, BarChart3, Menu, X } from 'lucide-react';
import ProfileModal from './ProfileModal';
import EditProfileModal from './EditProfileModal';

const Navbar = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    setShowProfileModal(false);
    setShowEditModal(true);
  };

  const handleSaveProfile = (updatedData) => {
    updateProfile(updatedData);
  };

  if (!user || location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const navLinks = user?.role === 'student' ? [
    { path: '/student/dashboard', label: 'Dashboard', icon: Home },
    { path: '/student/coding/free', label: 'Code Editor', icon: Code2 },
    { path: '/student/history', label: 'History', icon: BookOpen },
  ] : [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: Home },
    { path: '/teacher/push-code', label: 'Push Code', icon: Code2 }, 
    { path: '/teacher/exercises', label: 'Exercises', icon: BookOpen },
    { path: '/teacher/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <>
      <nav style={{
        background: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
          {/* Logo */}
          <Link to={user?.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Code2 size={20} color="white" />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1f2937' }}>
              CodeLearn
            </span>
          </Link>

          {/* Liens desktop - cachés sur mobile avec CSS */}
          <div className="desktop-nav" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: isActive(link.path) ? '#3b82f6' : '#4b5563',
                  background: isActive(link.path) ? '#eff6ff' : 'transparent',
                  fontWeight: isActive(link.path) ? '500' : '400',
                }}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Section utilisateur desktop */}
          <div className="desktop-user" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div 
              onClick={() => setShowProfileModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.5rem',
              }}
            >
              <div style={{
                width: '2rem',
                height: '2rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={16} color="white" />
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                  {user?.name}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  background: user?.role === 'teacher' ? '#dbeafe' : '#dcfce7',
                  color: user?.role === 'teacher' ? '#1e40af' : '#166534',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  display: 'block',
                  textAlign: 'center',
                }}>
                  {user?.role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>

            {/* Bouton menu mobile */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'none',
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'fixed',
          top: '4rem',
          left: 0,
          right: 0,
          background: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 49,
          padding: '1rem',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: isActive(link.path) ? '#3b82f6' : '#4b5563',
                marginBottom: '0.5rem',
              }}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          ))}
          <hr style={{ margin: '0.5rem 0' }} />
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={16} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {user?.role === 'teacher' ? 'Teacher' : 'Student'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal 
          user={user}
          onClose={() => setShowProfileModal(false)}
          onEdit={handleEditProfile}
        />
      )}

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
};

export default Navbar;