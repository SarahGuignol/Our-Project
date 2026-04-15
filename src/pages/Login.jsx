import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code2, Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.defaultRole) {
      setRole(location.state.defaultRole);
    }
  }, [location]);

  // Fonctions de validation
  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    
    // Regex pour validation email complète
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address (e.g., name@domain.com)';
    }
    
    // Vérification spécifique selon le rôle
    if (role === 'teacher' && !email.includes('@') && !email.includes('.edu')) {
      return 'Teacher email should be from an educational institution';
    }
    
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    // Vérifications supplémentaires
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    
    return '';
  };

  // Validation en temps réel
  useEffect(() => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
  }, [email, password, role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marquer tous les champs comme touchés
    setTouched({ email: true, password: true });
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (!emailError && !passwordError) {
      // Connexion réussie
      login(email, password, role);
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    }
  };

  const getEmailPlaceholder = () => {
    if (role === 'teacher') {
      return "teacher@school.edu";
    } else {
      return "student@university.edu";
    }
  };

  // Composant pour afficher la force du mot de passe
  const getPasswordStrength = () => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthText = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const strengthColor = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669'];
    
    return {
      text: strengthText[strength - 1] || 'Very Weak',
      color: strengthColor[strength - 1] || '#ef4444',
      width: `${(strength / 5) * 100}%`
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #ffffff 100%)',
    }}>
      {/* Navigation Bar */}
      <nav style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'white',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Code2 size={20} color="#3b82f6" />
          </div>
          <span style={{ color: 'white', fontWeight: '600', fontSize: '1.125rem' }}>CodeLearn</span>
        </Link>
        
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'white',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </nav>

      {/* Login Form */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem'
      }}>
        <div className="card" style={{ width: '450px', maxWidth: '100%', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Code2 size={48} color="#3b82f6" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ color: '#6b7280' }}>Sign in to continue to CodeLearn</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>I am a...</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="student"
                    checked={role === 'student'}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setEmail('');
                      setErrors({});
                    }}
                  />
                  Student
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="teacher"
                    checked={role === 'teacher'}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setEmail('');
                      setErrors({});
                    }}
                  />
                  Teacher
                </label>
              </div>
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  placeholder={getEmailPlaceholder()}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
                    border: `2px solid ${
                      touched.email && errors.email 
                        ? '#ef4444' 
                        : touched.email && !errors.email && email
                        ? '#10b981'
                        : '#d1d5db'
                    }`,
                    borderRadius: '0.5rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    if (!errors.email) e.target.style.borderColor = '#3b82f6';
                  }}
                />
                {touched.email && email && !errors.email && (
                  <CheckCircle size={18} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                )}
                {touched.email && errors.email && (
                  <XCircle size={18} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />
                )}
              </div>
              {touched.email && errors.email && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  placeholder="Enter your password"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
                    border: `2px solid ${
                      touched.password && errors.password 
                        ? '#ef4444' 
                        : touched.password && !errors.password && password
                        ? '#10b981'
                        : '#d1d5db'
                    }`,
                    borderRadius: '0.5rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: 'white',
                    paddingRight: '2.5rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {touched.password && password && !errors.password && (
                  <CheckCircle size={18} style={{ position: 'absolute', right: '2.5rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                )}
              </div>
              
              {/* Password strength indicator */}
              {password && !errors.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ 
                    height: '4px', 
                    background: '#e5e7eb', 
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: passwordStrength?.width || '0%',
                      height: '100%',
                      background: passwordStrength?.color,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '0.25rem',
                    fontSize: '0.7rem',
                    color: passwordStrength?.color
                  }}>
                    <span>Password strength: {passwordStrength?.text}</span>
                  </div>
                </div>
              )}
              
              {touched.password && errors.password && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Password requirements list */}
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '0.5rem',
              fontSize: '0.75rem'
            }}>
              <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Password requirements:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {password.length >= 8 ? <CheckCircle size={12} color="#10b981" /> : <XCircle size={12} color="#9ca3af" />}
                  <span>At least 8 characters</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {/[A-Z]/.test(password) ? <CheckCircle size={12} color="#10b981" /> : <XCircle size={12} color="#9ca3af" />}
                  <span>Uppercase letter</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {/[a-z]/.test(password) ? <CheckCircle size={12} color="#10b981" /> : <XCircle size={12} color="#9ca3af" />}
                  <span>Lowercase letter</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {/\d/.test(password) ? <CheckCircle size={12} color="#10b981" /> : <XCircle size={12} color="#9ca3af" />}
                  <span>Number</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? <CheckCircle size={12} color="#10b981" /> : <XCircle size={12} color="#9ca3af" />}
                  <span>Special character</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!!errors.email || !!errors.password || !email || !password}
              className="btn-primary"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                fontSize: '1rem',
                opacity: (errors.email || errors.password || !email || !password) ? 0.5 : 1,
                cursor: (errors.email || errors.password || !email || !password) ? 'not-allowed' : 'pointer'
              }}
            >
              Sign In
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </div>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            <p>Demo Credentials:</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
              <strong>Student:</strong> student@university.edu / Student@123<br />
              <strong>Teacher:</strong> teacher@school.edu / Teacher@123<br />
              <em>(Use any email format that passes validation)</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;