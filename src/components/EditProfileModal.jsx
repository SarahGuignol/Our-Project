import React, { useState, useRef } from 'react';
import { X, Camera, Save, Eye, EyeOff, User, Mail, Lock, Image } from 'lucide-react';

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    bio: user?.bio || 'Computer Science student passionate about algorithms and problem solving.',
    photo: user?.photo || null
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null);
  const fileInputRef = useRef(null);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (!/[A-Z]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Password must contain at least one uppercase letter';
      }
      if (!/[0-9]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Password must contain at least one number';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => {
          onSave(formData);
          onClose();
        }, 1500);
      }, 1000);
    }
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
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease',
      overflow: 'auto'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        animation: 'slideUp 0.3s ease'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem',
          position: 'relative',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Edit Profile</h2>
          <button
            onClick={onClose}
            style={{
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
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Photo Upload */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: photoPreview ? `url(${photoPreview}) center/cover` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                cursor: 'pointer',
                border: '3px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={() => fileInputRef.current.click()}
              >
                {!photoPreview && (
                  <Camera size={32} color="white" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Click to upload profile picture
            </p>
          </div>

          {/* Name Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.5rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.name}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.5rem',
                outline: 'none'
              }}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.email}
              </div>
            )}
          </div>

          {/* Bio Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              <Image size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Password Change Section */}
          <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '0.5rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} />
              Change Password (Optional)
            </h3>

            {/* Current Password */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Current Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '2.5rem',
                    border: `2px solid ${errors.currentPassword ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.currentPassword}
                </div>
              )}
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '2.5rem',
                    border: `2px solid ${errors.newPassword ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.newPassword}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '2.5rem',
                    border: `2px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          {formData.newPassword && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#f0fdf4',
              borderRadius: '0.5rem',
              fontSize: '0.75rem'
            }}>
              <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Password requirements:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                <div>✓ At least 8 characters</div>
                <div>✓ Uppercase letter</div>
                <div>✓ Lowercase letter</div>
                <div>✓ Number</div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#d1fae5',
              color: '#065f46',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              {successMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;