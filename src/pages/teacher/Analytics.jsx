import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const Analytics = () => {
  const { user } = useAuth();
  const [completionData, setCompletionData] = useState([]);
  const [strugglingStudents, setStrugglingStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExercises: 0,
    totalSubmissions: 0,
    averageGrade: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const classes = await api.getTeacherClasses(user?.id || 1);
      
      let allExercises = [];
      let allSubmissions = [];
      let studentIds = new Set();
      let allGrades = [];
      
      // Map pour stocker les exercices problématiques par étudiant
      const studentWorstExerciseMap = new Map();
      
      for (const cls of classes) {
        const enrollments = await api.getEnrollmentsByClass(cls.id);
        enrollments.forEach(e => studentIds.add(e.student_id));
        
        const exercises = await api.getClassExercises(cls.id);
        
        for (const ex of exercises) {
          const submissions = await api.getExerciseSubmissions(ex.id);
          
          const gradedSubmissions = submissions.filter(s => s.grade !== null);
          const avgGrade = gradedSubmissions.length > 0
            ? Math.round(gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length)
            : 0;
          
          allExercises.push({
            name: ex.title.length > 15 ? ex.title.substring(0, 12) + '...' : ex.title,
            completed: submissions.length,
            total: enrollments.length,
            avgGrade: avgGrade
          });
          
          allSubmissions.push(...submissions);
          submissions.forEach(s => {
            if (s.grade) allGrades.push(s.grade);
            
            // Tracker la pire note par étudiant
            if (s.student_id && s.grade !== null && s.grade < 60) {
              if (!studentWorstExerciseMap.has(s.student_id) || 
                  s.grade < studentWorstExerciseMap.get(s.student_id).worstGrade) {
                studentWorstExerciseMap.set(s.student_id, {
                  worstGrade: s.grade,
                  worstExerciseId: s.exercise_id,
                  worstExerciseTitle: ex.title
                });
              }
            }
          });
        }
      }
      window.allSubmissionsData = allSubmissions;
      // Calculer les étudiants en difficulté
      const studentGradeMap = new Map();
      for (const sub of allSubmissions) {
        if (sub.student_id) {
          if (!studentGradeMap.has(sub.student_id)) {
            studentGradeMap.set(sub.student_id, { 
              grades: [], 
              name: `Student #${sub.student_id}`,
              submissions: []
            });
          }
          const studentData = studentGradeMap.get(sub.student_id);
          studentData.submissions.push(sub);
          if (sub.grade !== null) {
            studentData.grades.push(sub.grade);
          }
        }
      }
      
      // Récupérer les noms des étudiants
      for (const [id, data] of studentGradeMap.entries()) {
        try {
          const userResponse = await fetch(`http://localhost:8000/api/users/${id}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            data.name = userData.name || `Student #${id}`;
          }
        } catch (e) {
          console.error('Error fetching user name:', e);
        }
      }
      
      // Filtrer les étudiants avec moyenne < 60 ou note < 50
      const struggling = [];
      for (const [id, data] of studentGradeMap.entries()) {
        const avgGrade = data.grades.length > 0 
          ? Math.round(data.grades.reduce((a, b) => a + b, 0) / data.grades.length) 
          : 0;
        
        const hasLowGrade = data.grades.some(grade => grade < 60);
        const worstInfo = studentWorstExerciseMap.get(id);
        
        if (avgGrade < 60 || hasLowGrade) {
          struggling.push({
            id: id,
            name: data.name,
            averageGrade: avgGrade,
            submissionCount: data.submissions.length,
            worstGrade: worstInfo?.worstGrade || 'N/A',
            worstExerciseId: worstInfo?.worstExerciseId,
            worstExerciseTitle: worstInfo?.worstExerciseTitle || 'Unknown'
          });
        }
      }
      
      // Trier par moyenne croissante
      struggling.sort((a, b) => a.averageGrade - b.averageGrade);
      
      setCompletionData(allExercises);
      setStrugglingStudents(struggling);
      setStats({
        totalStudents: studentIds.size,
        totalExercises: allExercises.length,
        totalSubmissions: allSubmissions.length,
        averageGrade: allGrades.length > 0 ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length) : 0
      });
      
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setLoading(false);
  };

  const handleReviewWork = (student) => {
  console.log("Student data:", student);
  
  // Chercher la soumission la plus récente de l'étudiant
  const findExerciseId = async () => {
    try {
      // Récupérer toutes les soumissions de l'étudiant
      const submissions = await api.getStudentSubmissions(student.id);
      console.log("Student submissions:", submissions);
      
      if (submissions && submissions.length > 0) {
        // Prendre la première soumission (ou celle avec la pire note)
        const worstSubmission = submissions.reduce((worst, current) => {
          if (!worst) return current;
          const currentGrade = current.grade || 100;
          const worstGrade = worst.grade || 100;
          return currentGrade < worstGrade ? current : worst;
        }, null);
        
        const exerciseId = worstSubmission?.exercise_id;
        console.log("Found exercise ID:", exerciseId);
        
        if (exerciseId) {
          navigate(`/teacher/submissions/${exerciseId}`);
        } else {
          alert("No exercise ID found for this student");
        }
      } else {
        alert("No submissions found for this student");
      }
    } catch (error) {
      console.error("Error finding exercise:", error);
      alert("Error loading student submissions");
    }
  };
  
  findExerciseId();
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
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Analytics Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Track student progress and identify learning patterns</p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Users size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalStudents}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Students</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingUp size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalExercises}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Exercises</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingUp size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageGrade}%</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Average Grade</div>
        </div>
      </div>

      {/* Chart */}
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
                <Bar dataKey="completed" fill="#3b82f6" name="Submissions" />
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
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Average Grade</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Worst Grade</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submissions</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {strugglingStudents.map((student, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{student.name}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        color: student.averageGrade < 50 ? '#ef4444' : student.averageGrade < 70 ? '#f59e0b' : '#10b981',
                        fontWeight: '600' 
                      }}>
                        {student.averageGrade}%
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: '600' }}>
                      {student.worstGrade}%
                    </td>
                    <td style={{ padding: '0.75rem' }}>{student.submissionCount}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button 
                        onClick={() => handleReviewWork(student)}
                        className="btn-secondary" 
                        style={{ 
                          padding: '0.25rem 0.75rem', 
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem'
                        }}
                      >
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