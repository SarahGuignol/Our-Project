import React from 'react';
import { X, Mail, Calendar, Award, BookOpen, TrendingUp, Edit2, User } from 'lucide-react';

const ProfileModal = ({ user, onClose, onEdit }) => {
  if (!user) return null;

  const studentStats = {
    totalExercises: 12,
    completedExercises: 8,
    averageGrade: 85,
    totalHours: 47,
    joinDate: '2024-01-15',
    streak: 15,
    rank: 'Gold Learner',
    badges: ['Quick Learner', 'Code Master', 'Problem Solver'],
    location: 'San Francisco, CA'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          padding: '2rem',
          textAlign: 'center',
          position: 'relative',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>
          
          <div style={{
            width: '80px',
            height: '80px',
            background: user?.photo ? `url(${user.photo}) center/cover` : 'white',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#3b82f6'
          }}>
            {!user?.photo && user.name.charAt(0)}
          </div>
          
          <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>{user.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
            {user.role === 'teacher' ? 'Teacher' : 'Student'} • Member since {studentStats.joinDate}
          </p>
          
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            marginTop: '0.5rem',
            fontSize: '0.75rem'
          }}>
            {studentStats.rank}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
              <BookOpen size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{studentStats.completedExercises}/{studentStats.totalExercises}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Exercises</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
              <Award size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{studentStats.averageGrade}%</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Avg Grade</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
              <TrendingUp size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{studentStats.totalHours}h</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Hours</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
              <Calendar size={24} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{studentStats.streak}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Streak 🔥</div>
            </div>
          </div>

          {/* Info Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                <User size={16} />
                <span>{user.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              {studentStats.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    <span>📍</span>  {/* Emoji au lieu de l'icône */}
                    <span>{studentStats.location}</span>
                </div>
                )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Bio</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5' }}>{user.bio}</p>
            </div>
          )}

          {/* Badges */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Achievements</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {studentStats.badges.map((badge, index) => (
                <span key={index} style={{
                  background: '#eff6ff',
                  color: '#1e40af',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  🏆 {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <Edit2 size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;