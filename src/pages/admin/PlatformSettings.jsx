import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Save, Globe, Shield, Key } from 'lucide-react';

const PlatformSettings = () => {
  const { getGlobalSettings, updateGlobalSettings } = useAuth();
  const [settings, setSettings] = useState({
    siteName: 'Algorithm Analyser & Debugger',
    maintenanceMode: false,
    allowSignups: true,
    aiApiKey: '',
    contactEmail: 'admin@codelearn.com'
  });

  useEffect(() => {
    const saved = getGlobalSettings();
    if (saved) setSettings(saved);
  }, []);

  const handleSave = () => {
    updateGlobalSettings(settings);
    alert('Settings saved successfully');
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Platform Settings</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Global system configuration</p>

      <div className="card" style={{ maxWidth: '700px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={20} /> General
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} /> Security & Access
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                />
                <span>Maintenance mode (blocks non-admin access)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.allowSignups}
                  onChange={e => setSettings({...settings, allowSignups: e.target.checked})}
                />
                <span>Allow public signups</span>
              </label>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={20} /> Integrations
            </h2>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>OpenAI API Key (for AI assistant)</label>
              <input
                type="password"
                value={settings.aiApiKey}
                onChange={e => setSettings({...settings, aiApiKey: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                placeholder="sk-..."
              />
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Key is stored locally (mock)</p>
            </div>
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleSave}>
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;