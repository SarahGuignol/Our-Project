import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Award, TrendingUp, Clock } from 'lucide-react';
import { api } from '../../services/api';

const SystemAnalytics = () => {
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [topExercises, setTopExercises] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState({ graded: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const classes = await api.getClasses();
      let allSubmissions = [];
      let exerciseStats = [];
      
      // Récupérer toutes les soumissions
      for (const cls of classes) {
        const exercises = await api.getClassExercises(cls.id);
        
        for (const ex of exercises) {
          const submissions = await api.getExerciseSubmissions(ex.id);
          allSubmissions.push(...submissions);
          
          const graded = submissions.filter(s => s.grade !== null);
          const avgGrade = graded.length > 0
            ? Math.round(graded.reduce((sum, s) => sum + s.grade, 0) / graded.length)
            : 0;
          
          exerciseStats.push({
            id: ex.id,
            title: ex.title.length > 25 ? ex.title.substring(0, 25) + '...' : ex.title,
            submissions: submissions.length,
            averageGrade: avgGrade,
            class: cls.name
          });
        }
      }
      
      // Statut des soumissions
      const gradedSubmissions = allSubmissions.filter(s => s.grade !== null);
      const pendingSubmissions = allSubmissions.filter(s => s.grade === null);
      setSubmissionStatus({
        graded: gradedSubmissions.length,
        pending: pendingSubmissions.length
      });
      
      // Distribution des notes (POURCENTAGES)
      const gradeRanges = [
        { range: '0-20%', count: 0, color: '#ef4444' },
        { range: '21-40%', count: 0, color: '#f59e0b' },
        { range: '41-60%', count: 0, color: '#eab308' },
        { range: '61-80%', count: 0, color: '#10b981' },
        { range: '81-100%', count: 0, color: '#3b82f6' }
      ];
      
      gradedSubmissions.forEach(sub => {
        if (sub.grade <= 20) gradeRanges[0].count++;
        else if (sub.grade <= 40) gradeRanges[1].count++;
        else if (sub.grade <= 60) gradeRanges[2].count++;
        else if (sub.grade <= 80) gradeRanges[3].count++;
        else gradeRanges[4].count++;
      });
      
      // Convertir en pourcentages
      const totalGraded = gradedSubmissions.length;
      const gradePercentages = gradeRanges.map(range => ({
        ...range,
        count: totalGraded > 0 ? Math.round((range.count / totalGraded) * 100) : 0
      }));
      
      setGradeDistribution(gradePercentages);
      
      // Top 5 exercices les plus tentés
      const top5 = exerciseStats
        .sort((a, b) => b.submissions - a.submissions)
        .slice(0, 5);
      setTopExercises(top5);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>System Analytics</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Detailed insights and statistics</p>

      {/* Two columns for charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Grade Distribution Chart */}
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} /> Grade Distribution (%)
          </h2>
          {gradeDistribution.some(g => g.count > 0) ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} layout="vertical" margin={{ left: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: 'Percentage (%)', position: 'bottom' }} />
                  <YAxis type="category" dataKey="range" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Students']} />
                  <Bar dataKey="count" fill="#3b82f6" name="Students (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#9ca3af' }}>No graded submissions yet</p>
            </div>
          )}
        </div>

        {/* Submission Status */}
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} /> Submission Status
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '250px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{submissionStatus.graded}</span>
              </div>
              <p style={{ fontWeight: '500' }}>Graded</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {submissionStatus.graded + submissionStatus.pending > 0 
                  ? Math.round((submissionStatus.graded / (submissionStatus.graded + submissionStatus.pending)) * 100) 
                  : 0}%
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{submissionStatus.pending}</span>
              </div>
              <p style={{ fontWeight: '500' }}>Pending</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {submissionStatus.graded + submissionStatus.pending > 0 
                  ? Math.round((submissionStatus.pending / (submissionStatus.graded + submissionStatus.pending)) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Exercises Table */}
      <div className="card">
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} /> Most Attempted Exercises
        </h2>
        {topExercises.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Exercise</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Class</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submissions</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Average Grade</th>
                </tr>
              </thead>
              <tbody>
                {topExercises.map((ex, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{ex.title}</td>
                    <td style={{ padding: '0.75rem' }}>{ex.class}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        background: '#eff6ff',
                        color: '#3b82f6'
                      }}>
                        {ex.submissions}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {ex.averageGrade > 0 ? (
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          background: ex.averageGrade >= 70 ? '#dcfce7' : '#fef3c7',
                          color: ex.averageGrade >= 70 ? '#166534' : '#92400e'
                        }}>
                          {ex.averageGrade}%
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No exercise data available</p>
        )}
      </div>
    </div>
  );
};

export default SystemAnalytics;