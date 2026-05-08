import React, { useState, useEffect } from 'react';
import { X, Mail, Calendar, Award, BookOpen, Edit2, User, Users, Camera } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ProfileModal = ({ user, onClose, onEdit }) => {
  const { updateUserPhoto } = useAuth();
  const [stats, setStats] = useState({
    totalExercises: 0,
    completedExercises: 0,
    averageGrade: 0,
    enrolledClasses: 0,
    totalStudents: 0,
    totalClasses: 0,
    joinDate: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null);

  useEffect(() => {
    loadStatsFromAPI();
    if (user?.photo) {
      setPhotoPreview(user.photo);
    }
    loadUserJoinDate();
  }, [user]);

  const loadStatsFromAPI = async () => {
    setLoading(true);
    try {
      if (user?.role === 'student') {
        const enrollments = await api.getStudentEnrollments(user.id);
        const submissions = await api.getStudentSubmissions(user.id);
        
        const completedExercises = submissions.filter(s => s.grade !== null).length;
        const gradedSubmissions = submissions.filter(s => s.grade !== null);
        const averageGrade = gradedSubmissions.length > 0
          ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length)
          : 0;
        
        setStats({
          enrolledClasses: enrollments.length,
          totalExercises: submissions.length,
          completedExercises: completedExercises,
          averageGrade: averageGrade,
          joinDate: user?.joinDate || new Date().toISOString().split('T')[0]
        });
      } else if (user?.role === 'teacher') {
        const classes = await api.getTeacherClasses(user.id);
        let allStudents = new Set();
        let totalExercises = 0;
        
        for (const cls of classes) {
          const enrollments = await api.getEnrollmentsByClass(cls.id);
          enrollments.forEach(e => allStudents.add(e.student_id));
          const exercises = await api.getClassExercises(cls.id);
          totalExercises += exercises.length;
        }
        
        setStats({
          totalClasses: classes.length,
          totalStudents: allStudents.size,
          totalExercises: totalExercises,
          joinDate: user?.joinDate || new Date().toISOString().split('T')[0]
        });
      } else if (user?.role === 'admin') {
        const users = await api.getUsers();
        const classes = await api.getClasses();
        
        setStats({
          totalUsers: users.length,
          totalStudents: users.filter(u => u.role === 'student').length,
          totalTeachers: users.filter(u => u.role === 'teacher').length,
          totalClasses: classes.length,
          joinDate: user?.joinDate || new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    setLoading(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingPhoto(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Photo = reader.result;
      setPhotoPreview(base64Photo);
      
      const success = await updateUserPhoto(base64Photo);
      if (success && onEdit) {
        onEdit({ ...user, photo: base64Photo });
      }
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const loadUserJoinDate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}`);
      const data = await response.json();
      if (data.join_date) {
        setJoinDate(data.join_date.split(' ')[0]);
      }
    } catch (error) {
      console.error('Error loading join date:', error);
    }
  };

  const [joinDate, setJoinDate] = useState(null);

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
        
        {/* Header avec photo */}
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
          
          {/* Photo de profil */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: photoPreview ? `url(${photoPreview}) center/cover` : 'white',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              border: '3px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {!photoPreview && (user.name?.charAt(0) || 'U')}
            </div>
          
          </div>
          
          {uploadingPhoto && (
            <p style={{ color: 'white', fontSize: '0.75rem', marginTop: '0.5rem' }}>Uploading...</p>
          )}
          
          <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>{user.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
            {user.role === 'teacher' ? 'Teacher' : user.role === 'admin' ? 'Administrator' : 'Student'}
            {joinDate && ` • Member since ${joinDate}`}
          </p>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Stats */}
          {!loading && (
            <div style={{ marginBottom: '1.5rem' }}>
              {user.role === 'student' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <Users size={24} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.enrolledClasses || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Classes</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <BookOpen size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.completedExercises || 0}/{stats.totalExercises || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Exercises</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <Award size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageGrade || 0}%</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Average Grade</div>
                  </div>
                </div>
              )}
              
              {user.role === 'teacher' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <BookOpen size={24} color="#3b82f6" />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalClasses || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Classes</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <Users size={24} color="#8b5cf6" />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalStudents || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Students</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Infos */}
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
              {joinDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  <Calendar size={16} />
                  <span>Joined {joinDate}</span>
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