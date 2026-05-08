import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Save, Globe, Shield, Key, Bell, Database, Mail, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const PlatformSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    siteName: 'Algorithm Analyser & Debugger',
    siteDescription: 'Learn algorithms with AI-powered debugging',
    contactEmail: 'admin@gmail.com',
    maintenanceMode: false,
    allowSignups: true,
    requireEmailVerification: false,
    defaultUserRole: 'student',
    itemsPerPage: 10,
    enableEmailNotifications: true,
    enableAiFeedback: true,
    aiModel: 'llama-3.3-70b-versatile',
    maxCodeLength: 5000,
    maxSubmissionsPerDay: 50
  });
  
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Charger les paramètres depuis l'API (si existants)
      const response = await fetch('http://localhost:8000/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.log('No saved settings found, using defaults');
    }
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('http://localhost:8000/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings: ' + error.message });
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!adminPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    
    setPasswordSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: adminPassword,
          new_password: newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setAdminPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error changing password' });
    }
    setPasswordSaving(false);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setSettings({
        siteName: 'Algorithm Analyser & Debugger',
        siteDescription: 'Learn algorithms with AI-powered debugging',
        contactEmail: 'admin@codelearn.com',
        maintenanceMode: false,
        allowSignups: true,
        requireEmailVerification: false,
        defaultUserRole: 'student',
        itemsPerPage: 10,
        enableEmailNotifications: true,
        enableAiFeedback: true,
        aiModel: 'llama-3.3-70b-versatile',
        maxCodeLength: 5000,
        maxSubmissionsPerDay: 50
      });
      setMessage({ type: 'success', text: 'Reset to default values' });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Platform Settings</h1>
          <p style={{ color: '#6b7280' }}>Configure system-wide settings and preferences</p>
        </div>
        <button 
          onClick={handleResetDefaults}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={18} /> Reset to Defaults
        </button>
      </div>

      {/* Message notification */}
      {message && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* General Settings */}
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} /> General Settings
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={e => setSettings({...settings, siteDescription: e.target.value})}
                rows="2"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Items Per Page</label>
              <select
                value={settings.itemsPerPage}
                onChange={e => setSettings({...settings, itemsPerPage: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} /> Security & Access
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span>Maintenance Mode</span>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span>Allow Public Signups</span>
              <input
                type="checkbox"
                checked={settings.allowSignups}
                onChange={e => setSettings({...settings, allowSignups: e.target.checked})}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span>Require Email Verification</span>
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={e => setSettings({...settings, requireEmailVerification: e.target.checked})}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Default User Role</label>
              <select
                value={settings.defaultUserRole}
                onChange={e => setSettings({...settings, defaultUserRole: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={20} /> AI Configuration
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span>Enable AI Feedback</span>
              <input
                type="checkbox"
                checked={settings.enableAiFeedback}
                onChange={e => setSettings({...settings, enableAiFeedback: e.target.checked})}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>AI Model</label>
              <select
                value={settings.aiModel}
                onChange={e => setSettings({...settings, aiModel: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              >
                <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
                <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                <option value="gemma2-9b-it">Gemma 2 9B</option>
              </select>
            </div>
          </div>
        </div>

        {/* Limitations */}
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} /> Limitations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Max Code Length (characters)</label>
              <input
                type="number"
                value={settings.maxCodeLength}
                onChange={e => setSettings({...settings, maxCodeLength: parseInt(e.target.value)})}
                min="100"
                max="50000"
                step="100"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Max Submissions Per Day</label>
              <input
                type="number"
                value={settings.maxSubmissionsPerDay}
                onChange={e => setSettings({...settings, maxSubmissionsPerDay: parseInt(e.target.value)})}
                min="1"
                max="100"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} /> Change Admin Password
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', paddingRight: '2rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', paddingRight: '2rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleChangePassword}
              disabled={passwordSaving}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Lock size={16} /> {passwordSaving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
};

export default PlatformSettings;