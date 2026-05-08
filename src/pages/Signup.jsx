import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code2, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
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

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    let error = '';
    if (name === 'name') error = validateName(value);
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value);
    if (name === 'confirmPassword') error = validateConfirmPassword(value, formData.password);
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldStatus = (field) => {
    if (!touched[field]) return null;
    if (errors[field]) return 'error';
    if (formData[field]) return 'success';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password);
    
    if (!nameError && !emailError && !passwordError && !confirmError) {
      setLoading(true);
      
      try {
        await signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          bio: formData.bio || 'Computer Science student passionate about algorithms.' 
        });
        
        navigate(formData.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
      } catch (error) {
        alert(error.message || 'Signup failed. This email may already be registered.');
      }
      
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #ffffff 100%)',
    }}>
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
            width: '2rem', height: '2rem', background: 'white',
            borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Code2 size={20} color="#3b82f6" />
          </div>
          <span style={{ color: 'white', fontWeight: '600', fontSize: '1.125rem' }}>CodeLearn</span>
        </Link>
        
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white',
          textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem',
          background: 'rgba(255,255,255,0.2)'
        }}>
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </nav>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)', padding: '2rem'
      }}>
        <div className="card" style={{ width: '500px', maxWidth: '100%', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Code2 size={48} color="#3b82f6" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Create Account</h1>
            <p style={{ color: '#6b7280' }}>Join CodeLearn to start learning</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>I am a...</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="role" value="student"
                    checked={formData.role === 'student'} onChange={handleChange} />
                  Student
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="role" value="teacher"
                    checked={formData.role === 'teacher'} onChange={handleChange} />
                  Teacher
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input type="text" name="name" value={formData.name}
                  onChange={handleChange} onBlur={() => handleBlur('name')}
                  placeholder="John Doe"
                  style={{
                    width: '100%', padding: '0.75rem',
                    border: `2px solid ${getFieldStatus('name') === 'error' ? '#ef4444' : getFieldStatus('name') === 'success' ? '#10b981' : '#d1d5db'}`,
                    borderRadius: '0.5rem', outline: 'none', fontSize: '1rem'
                  }} />
                {getFieldStatus('name') === 'success' && (
                  <CheckCircle size={18} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                )}
              </div>
              {touched.name && errors.name && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Email *
              </label>
              <div style={{ position: 'relative' }}>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  style={{
                    width: '100%', padding: '0.75rem',
                    border: `2px solid ${getFieldStatus('email') === 'error' ? '#ef4444' : getFieldStatus('email') === 'success' ? '#10b981' : '#d1d5db'}`,
                    borderRadius: '0.5rem', outline: 'none', fontSize: '1rem'
                  }} />
                {getFieldStatus('email') === 'success' && (
                  <CheckCircle size={18} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }} />
                )}
              </div>
              {touched.email && errors.email && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</div>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange} onBlur={() => handleBlur('password')}
                  placeholder="Create a password"
                  style={{
                    width: '100%', padding: '0.75rem', paddingRight: '2.5rem',
                    border: `2px solid ${getFieldStatus('password') === 'error' ? '#ef4444' : getFieldStatus('password') === 'success' ? '#10b981' : '#d1d5db'}`,
                    borderRadius: '0.5rem', outline: 'none', fontSize: '1rem'
                  }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange} onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Confirm your password"
                  style={{
                    width: '100%', padding: '0.75rem', paddingRight: '2.5rem',
                    border: `2px solid ${getFieldStatus('confirmPassword') === 'error' ? '#ef4444' : getFieldStatus('confirmPassword') === 'success' ? '#10b981' : '#d1d5db'}`,
                    borderRadius: '0.5rem', outline: 'none', fontSize: '1rem'
                  }} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</div>
              )}
            </div>

            <button type="submit" className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginBottom: '1rem', opacity: loading ? 0.5 : 1 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;