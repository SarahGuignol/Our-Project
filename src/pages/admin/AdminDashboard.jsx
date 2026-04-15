import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, BookOpen, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { allUsers } = useAuth();
  
  const totalStudents = allUsers?.filter(u => u.role === 'student').length || 0;
  const totalTeachers = allUsers?.filter(u => u.role === 'teacher').length || 0;
  const totalUsers = allUsers?.length || 0;
  
  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'submitted an exercise', time: '10 min ago' },
    { id: 2, user: 'Dr. Smith', action: 'created an exercise', time: '1 hour ago' },
    { id: 3, user: 'Admin', action: 'updated settings', time: '3 hours ago' },
  ];

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: '#3b82f6' },
    { label: 'Students', value: totalStudents, icon: Users, color: '#10b981' },
    { label: 'Teachers', value: totalTeachers, icon: Users, color: '#f59e0b' },
    { label: 'Exercises', value: '15', icon: BookOpen, color: '#8b5cf6' },
    { label: 'Submissions', value: '142', icon: Activity, color: '#ec4899' },
    { label: 'Completion Rate', value: '78%', icon: TrendingUp, color: '#06b6d4' },
  ];

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Platform overview and supervision</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: stat.color + '20', padding: '0.75rem', borderRadius: '0.5rem' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} /> Recent Activity
          </h2>
          <div>
            {recentActivity.map(act => (
              <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <div>
                  <span style={{ fontWeight: '500' }}>{act.user}</span>
                  <span style={{ color: '#6b7280' }}> {act.action}</span>
                </div>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#f59e0b" /> System Alerts
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0', color: '#374151' }}>✅ All services operational</li>
            <li style={{ padding: '0.5rem 0', color: '#374151' }}>⚠️ 2 exercises pending moderation</li>
            <li style={{ padding: '0.5rem 0', color: '#374151' }}>📊 Login spike detected yesterday</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;