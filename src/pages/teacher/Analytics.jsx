import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Users } from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [completionData, setCompletionData] = useState([]);
  const [strugglingStudents, setStrugglingStudents] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    // Load all classes for this teacher
    const savedClasses = localStorage.getItem('teacherClasses');
    let teacherClasses = [];
    
    if (savedClasses) {
      const allClasses = JSON.parse(savedClasses);
      teacherClasses = allClasses.filter(c => c.teacherId === user?.id);
    }

    // Collect all exercises and submissions
    const allExercises = [];
    const allSubmissions = [];
    const exerciseCompletion = [];

    teacherClasses.forEach(cls => {
      const savedExercises = localStorage.getItem(`exercises_${cls.id}`);
      if (savedExercises) {
        const exercises = JSON.parse(savedExercises);
        
        exercises.forEach(ex => {
          // For completion chart
          const savedSubmissions = localStorage.getItem(`submissions_${ex.id}`);
          let submissions = [];
          if (savedSubmissions) {
            submissions = JSON.parse(savedSubmissions);
          }
          
          exerciseCompletion.push({
            name: ex.title.length > 15 ? ex.title.substring(0, 12) + '...' : ex.title,
            completed: submissions.length,
            total: cls.students || 0
          });

          // For struggling students
          submissions.forEach(sub => {
            allSubmissions.push({
              ...sub,
              exerciseTitle: ex.title,
              classId: cls.id
            });
          });
        });

        allExercises.push(...exercises);
      }
    });

    setCompletionData(exerciseCompletion);

    // Calculate struggling students
    const struggling = calculateStrugglingStudents(allSubmissions, allExercises);
    setStrugglingStudents(struggling);
  };

  const calculateStrugglingStudents = (submissions, exercises) => {
    const studentMap = new Map();

    submissions.forEach(sub => {
      if (!studentMap.has(sub.name)) {
        studentMap.set(sub.name, {
          name: sub.name,
          errors: 0,
          submissions: 0,
          grades: [],
          complexityScore: 'N/A'
        });
      }

      const student = studentMap.get(sub.name);
      student.submissions++;

      // Count "errors" based on low grades or missing submissions
      if (sub.grade !== null && sub.grade !== undefined) {
        student.grades.push(sub.grade);
        if (sub.grade < 70) {
          student.errors++;
        }
      } else {
        student.errors++; // No grade = considered as error/struggling
      }

      // Determine complexity score based on average grade
      const avgGrade = student.grades.length > 0 
        ? student.grades.reduce((a, b) => a + b, 0) / student.grades.length 
        : 0;

      if (avgGrade < 60) {
        student.complexityScore = 'O(n²)';
      } else if (avgGrade < 80) {
        student.complexityScore = 'O(n log n)';
      } else {
        student.complexityScore = 'O(n)';
      }
    });

    // Convert to array and filter only struggling students (with errors)
    const students = Array.from(studentMap.values())
      .filter(s => s.errors > 0)
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 5); // Top 5 struggling students

    return students;
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Analytics Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Track student progress and identify learning patterns</p>

      {/* Charts */}
      {completionData.length > 0 ? (
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
      ) : (
        <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#9ca3af' }}>No exercise data available yet.</p>
        </div>
      )}

      {/* Struggling Students */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <AlertTriangle size={24} color="#f59e0b" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Students Who May Need Extra Help</h2>
        </div>
        
        {strugglingStudents.length > 0 ? (
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
                {strugglingStudents.map((student, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{student.name}</td>
                    <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: '600' }}>{student.errors}</td>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{student.complexityScore}</td>
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
        ) : (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>
            No struggling students detected. Great job!
          </p>
        )}
      </div>
    </div>
  );
};

export default Analytics;