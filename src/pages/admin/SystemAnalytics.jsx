import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Users, Clock, Award } from 'lucide-react';

const SystemAnalytics = () => {
  const submissionData = [
    { name: 'Mon', submissions: 24 },
    { name: 'Tue', submissions: 30 },
    { name: 'Wed', submissions: 45 },
    { name: 'Thu', submissions: 38 },
    { name: 'Fri', submissions: 52 },
    { name: 'Sat', submissions: 20 },
    { name: 'Sun', submissions: 15 },
  ];

  const userActivity = [
    { name: 'Week 1', active: 120 },
    { name: 'Week 2', active: 145 },
    { name: 'Week 3', active: 168 },
    { name: 'Week 4', active: 190 },
  ];

  const topExercises = [
    { title: 'Find Maximum Number', attempts: 78, successRate: 82 },
    { title: 'Calculate Factorial', attempts: 65, successRate: 75 },
    { title: 'Bubble Sort', attempts: 52, successRate: 68 },
  ];

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>System Analytics</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Global usage statistics</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} /> Daily Submissions
          </h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="submissions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} /> Weekly Active Users
          </h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Key Metrics</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> Avg Session Time</span>
              <span style={{ fontWeight: 'bold' }}>24 min</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={18} /> Avg Success Rate</span>
              <span style={{ fontWeight: 'bold' }}>76%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> Total Exercises</span>
              <span style={{ fontWeight: 'bold' }}>23</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Top Exercises</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Attempts</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Success</th>
              </tr>
            </thead>
            <tbody>
              {topExercises.map((ex, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.5rem' }}>{ex.title}</td>
                  <td style={{ padding: '0.5rem' }}>{ex.attempts}</td>
                  <td style={{ padding: '0.5rem' }}>{ex.successRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;