import React, { useState } from 'react';
import { Flag, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ContentModeration = () => {
  const [reports, setReports] = useState([
    { id: 1, exercise: 'Sorting Algorithm', reportedBy: 'user@mail.com', reason: 'Inappropriate content', date: '2024-03-10', status: 'pending' },
    { id: 2, exercise: 'Factorial', reportedBy: 'teacher@school.edu', reason: 'Too difficult', date: '2024-03-09', status: 'pending' },
  ]);

  const handleAction = (id, action) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Content Moderation</h1>
          <p style={{ color: '#6b7280' }}>Monitor reports and inappropriate content</p>
        </div>
        <div>
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
            {reports.filter(r => r.status === 'pending').length} pending
          </span>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Exercise</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Reported By</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Reason</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem', fontWeight: '500' }}>{report.exercise}</td>
                <td style={{ padding: '0.75rem' }}>{report.reportedBy}</td>
                <td style={{ padding: '0.75rem' }}>{report.reason}</td>
                <td style={{ padding: '0.75rem' }}>{report.date}</td>
                <td style={{ padding: '0.75rem' }}>
                  {report.status === 'pending' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706' }}>
                      <AlertTriangle size={14} /> Pending
                    </span>
                  )}
                  {report.status === 'approved' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981' }}>
                      <CheckCircle size={14} /> Approved
                    </span>
                  )}
                  {report.status === 'rejected' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444' }}>
                      <XCircle size={14} /> Rejected
                    </span>
                  )}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {report.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleAction(report.id, 'approved')}
                        style={{ background: 'none', border: 'none', padding: '0.25rem', cursor: 'pointer', color: '#10b981' }}
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'rejected')}
                        style={{ background: 'none', border: 'none', padding: '0.25rem', cursor: 'pointer', color: '#ef4444' }}
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>
                      <button style={{ background: 'none', border: 'none', padding: '0.25rem', cursor: 'pointer', color: '#3b82f6' }} title="View Exercise">
                        <Eye size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
        <h3 style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Flag size={18} /> Moderation Log
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>No recent actions</p>
      </div>
    </div>
  );
};

export default ContentModeration;