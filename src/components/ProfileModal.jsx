import React, { useState, useEffect } from 'react';
import { X, Mail, Calendar, Award, BookOpen, TrendingUp, Edit2, User, Users } from 'lucide-react';
import { calculateStudentStats, initializeMockData } from '../data/mockData';

const ProfileModal = ({ user, onClose, onEdit }) => {
  const [stats, setStats] = useState({
    totalExercises: 0,
    completedExercises: 0,
    averageGrade: 0,
    totalHours: 0,
    enrolledClasses: 0,
    joinDate: '',
    location: 'San Francisco, CA'
  });

  useEffect(() => {
    initializeMockData();
    
    if (user?.role === 'student') {
      const studentStats = calculateStudentStats(user);
      setStats(studentStats);
    } else if (user?.role === 'teacher') {
      calculateTeacherStats();
    } else if (user?.role === 'admin') {
      calculateAdminStats();
    }
  }, [user]);

  const calculateTeacherStats = () => {
    // Load from teacherClasses in localStorage
    const savedClasses = localStorage.getItem('teacherClasses');
    let teacherClasses = [];
    
    if (savedClasses) {
      const allClasses = JSON.parse(savedClasses);
      teacherClasses = allClasses.filter(c => c.teacherId === user?.id);
    }
    
    // If no classes, use mock data
    if (teacherClasses.length === 0) {
      teacherClasses = [
        { id: 1, name: 'CS101 - Programming Fundamentals', students: 25 },
        { id: 2, name: 'CS201 - Data Structures', students: 20 }
      ];
    }
    
    // Calculate total exercises
    let totalExercises = 0;
    teacherClasses.forEach(cls => {
      const savedExercises = localStorage.getItem(`exercises_${cls.id}`);
      if (savedExercises) {
        totalExercises += JSON.parse(savedExercises).length;
      }
    });
    
    const totalStudents = teacherClasses.reduce((sum, cls) => sum + (cls.students || 0), 0);
    
    setStats({
      totalClasses: teacherClasses.length,
      totalStudents: totalStudents,
      totalExercises: totalExercises,
      averageGrade: 0,
      totalHours: teacherClasses.length * 45,
      joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
      location: 'Faculty Office'
    });
  };

  const calculateAdminStats = () => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const teacherClasses = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    
    const totalStudents = allUsers.filter(u => u.role === 'student').length;
    const totalTeachers = allUsers.filter(u => u.role === 'teacher').length;
    
    setStats({
      totalUsers: allUsers.length,
      totalStudents: totalStudents,
      totalTeachers: totalTeachers,
      totalClasses: teacherClasses.length,
      joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
      location: 'Admin Office'
    });
  };

  if (!user) return null;

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
        maxHeight: '85vh',
        overflow: 'auto',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          padding: '2rem',
          textAlign: 'center',
          position: 'relative',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            cursor: 'pointer',
            color: 'white'
          }}>
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
            {!user?.photo && (user.name?.charAt(0) || 'U')}
          </div>
          
          <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>{user.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
            {user.role === 'teacher' ? 'Teacher' : user.role === 'admin' ? 'Administrator' : 'Student'}
            {stats.joinDate && ` • Member since ${stats.joinDate}`}
          </p>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {user.role === 'student' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <Users size={24} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.enrolledClasses}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Enrolled Classes</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <BookOpen size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.completedExercises}/{stats.totalExercises}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Exercises Done</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <Award size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageGrade}%</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Average Grade</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <TrendingUp size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalHours}h</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Hours Coded</div>
              </div>
            </div>
          ) : user.role === 'teacher' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <BookOpen size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalClasses || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Classes</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <Users size={24} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalStudents || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Students</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <Award size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalExercises || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Exercises</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <TrendingUp size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageGrade || 0}%</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Avg Grade</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <Users size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalUsers || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total Users</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <Users size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalStudents || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Students</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <Users size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalTeachers || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Teachers</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <BookOpen size={24} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalClasses || 0}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Classes</div>
              </div>
            </div>
          )}

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
              {stats.joinDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  <Calendar size={16} />
                  <span>Joined {stats.joinDate}</span>
                </div>
              )}
            </div>
          </div>

          {user.bio && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Bio</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5' }}>{user.bio}</p>
            </div>
          )}

          <button onClick={onEdit} style={{
            width: '100%',
            padding: '0.75rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            <Edit2 size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;