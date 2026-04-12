import React, { useState } from 'react';
import { Clock, CheckCircle, MessageCircle, Award } from 'lucide-react';

const StudentHistory = () => {
  const [submissions] = useState([
    {
      id: 1,
      exerciseTitle: 'Find Maximum Number',
      submittedAt: '2024-01-15',
      grade: 85,
      teacherComment: 'Good work! Consider handling empty arrays.',
      status: 'graded',
    },
    {
      id: 2,
      exerciseTitle: 'Calculate Factorial',
      submittedAt: '2024-01-10',
      grade: 92,
      teacherComment: 'Excellent optimization!',
      status: 'graded',
    },
  ]);

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Submission History</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>View your past submissions and feedback</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {submissions.map(submission => (
          <div key={submission.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{submission.exerciseTitle}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  <Clock size={14} />
                  <span>Submitted: {submission.submittedAt}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="#f59e0b" />
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{submission.grade}%</span>
              </div>
            </div>

            {submission.teacherComment && (
              <div style={{
                background: '#f3f4f6',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginTop: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MessageCircle size={16} color="#3b82f6" />
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>Teacher's Feedback:</span>
                </div>
                <p style={{ color: '#374151', fontSize: '0.875rem' }}>{submission.teacherComment}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentHistory;