import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code2, LogOut, User, Home, BookOpen, BarChart3, Menu, X, Settings } from 'lucide-react';
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
    console.log("Saving profile data:", updatedData);
    console.log("Photo data:", updatedData.photo ? "Photo present" : "No photo");
    updateProfile(updatedData);
    setTimeout(() => {
    const savedUser = localStorage.getItem('user');
    console.log("Saved user:", JSON.parse(savedUser));
  }, 100);
  };

  // Ne pas afficher la navbar sur la landing page et login
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
          padding: '0.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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

          {/* Desktop Navigation */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem'
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: isActive(link.path) ? '#3b82f6' : '#4b5563',
                  background: isActive(link.path) ? '#eff6ff' : 'transparent',
                  fontWeight: isActive(link.path) ? '500' : '400',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Info & Logout - RENDU CLIQUABLE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Profile section - CLICKABLE */}
            <div 
              onClick={() => setShowProfileModal(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                  {user?.name}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  background: user?.role === 'teacher' ? '#dbeafe' : '#dcfce7',
                  color: user?.role === 'teacher' ? '#1e40af' : '#166534',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  textAlign: 'center',
                  marginTop: '0.125rem'
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
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                '@media (max-width: 768px)': {
                  display: 'block'
                }
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '4rem',
          left: 0,
          right: 0,
          background: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 49,
          padding: '1rem'
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
                background: isActive(link.path) ? '#eff6ff' : 'transparent',
                marginBottom: '0.5rem'
              }}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          user={user}
          onClose={() => setShowProfileModal(false)}
          onEdit={handleEditProfile}
        />
      )}

      {/* Edit Profile Modal */}
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