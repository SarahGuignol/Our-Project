import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Users } from 'lucide-react';

const Analytics = () => {
  const [completionData] = useState([
    { name: 'Find Max', completed: 20, total: 25 },
    { name: 'Factorial', completed: 18, total: 25 },
    { name: 'Bubble Sort', completed: 15, total: 20 },
    { name: 'Binary Search', completed: 12, total: 20 },
  ]);

  const [strugglingStudents] = useState([
    { name: 'John Doe', errors: 12, complexity: 'O(n²)' },
    { name: 'Alice Brown', errors: 8, complexity: 'O(n²)' },
    { name: 'Bob Wilson', errors: 7, complexity: 'O(n log n)' },
  ]);

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Analytics Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Track student progress and identify learning patterns</p>

      {/* Charts */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Exercise Completion Rates</h2>
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
              <Bar dataKey="total" fill="#9ca3af" name="Total Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Struggling Students */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <AlertTriangle size={24} color="#f59e0b" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Students Who May Need Extra Help</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Student Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Error Count</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Complexity Score</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {strugglingStudents.map(student => (
                <tr key={student.name} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem' }}>{student.name}</td>
                  <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: '600' }}>{student.errors}</td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{student.complexity}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                      Review Work
                    </button>
                  </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;