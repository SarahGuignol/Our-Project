import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, BookOpen, LogIn, CheckCircle, X } from 'lucide-react';
import { allPlatformClasses, initializeMockData } from '../../data/mockData';

const BrowseClasses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('className');
  const [availableClasses, setAvailableClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [enrolledClass, setEnrolledClass] = useState(null);

  useEffect(() => {
    initializeMockData();
    
    const myEnrolledClasses = JSON.parse(localStorage.getItem('enrolledClasses') || '[1, 2]');
    
    const available = allPlatformClasses.filter(
      cls => !myEnrolledClasses.includes(cls.id)
    );
    
    setAvailableClasses(available);
    setEnrolledClasses(myEnrolledClasses);
  }, []);

  const filteredClasses = availableClasses.filter(cls => {
    if (!searchTerm) return true;
    
    if (searchBy === 'className') {
      return cls.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return cls.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const handleEnroll = (cls) => {
    const updatedEnrolled = [...enrolledClasses, cls.id];
    setEnrolledClasses(updatedEnrolled);
    setAvailableClasses(availableClasses.filter(c => c.id !== cls.id));
    setEnrolledClass(cls);
    setShowSuccessModal(true);
    localStorage.setItem('enrolledClasses', JSON.stringify(updatedEnrolled));
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Browse Classes
        </h1>
        <p style={{ color: '#6b7280' }}>
          Search and enroll in new classes to access exercises and learning materials
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchBy === 'className' ? 'Search by class name...' : 'Search by teacher name...'}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setSearchBy('className')}
              style={{
                padding: '0.5rem 1rem',
                background: searchBy === 'className' ? '#3b82f6' : '#e5e7eb',
                color: searchBy === 'className' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <BookOpen size={16} /> By Class
            </button>
            <button
              onClick={() => setSearchBy('teacherName')}
              style={{
                padding: '0.5rem 1rem',
                background: searchBy === 'teacherName' ? '#3b82f6' : '#e5e7eb',
                color: searchBy === 'teacherName' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Users size={16} /> By Teacher
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: '#6b7280' }}>
          {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} available
        </p>
      </div>

      {filteredClasses.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredClasses.map(cls => (
            <div key={cls.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {cls.name}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={14} /> {cls.teacher}
                </p>
              </div>
              
              <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                {cls.description}
              </p>
              
              <div style={{ 
                marginTop: 'auto',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  <Users size={14} />
                  <span>{cls.students} students enrolled</span>
                </div>
                
                <button
                  onClick={() => handleEnroll(cls)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <LogIn size={16} /> Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Search size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
            No classes found
          </p>
          <p style={{ color: '#9ca3af' }}>
            Try adjusting your search terms
          </p>
        </div>
      )}

      {showSuccessModal && (
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
          <div className="card" style={{ width: '400px', maxWidth: '90%', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <CheckCircle size={32} color="white" />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Successfully Enrolled!
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                You are now enrolled in <strong>{enrolledClass?.name}</strong>
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="btn-secondary"
              >
                Browse More
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/student/dashboard');
                }}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseClasses;