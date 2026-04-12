import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, Plus } from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [classes] = useState([
    {
      id: 1,
      name: 'CS101 - Programming Fundamentals',
      students: 25,
      exercises: [
        { id: 1, title: 'Find Maximum Number', submissions: 20, averageGrade: 78 },
        { id: 2, title: 'Calculate Factorial', submissions: 18, averageGrade: 82 },
      ],
    },
    {
      id: 2,
      name: 'CS201 - Data Structures',
      students: 20,
      exercises: [
        { id: 3, title: 'Bubble Sort', submissions: 15, averageGrade: 75 },
        { id: 4, title: 'Binary Search', submissions: 12, averageGrade: 80 },
      ],
    },
  ]);

  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
  const totalExercises = classes.reduce((sum, c) => sum + c.exercises.length, 0);
  const avgCompletion = 68; // Mock percentage

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Teacher Dashboard</h1>
          <p style={{ color: '#6b7280' }}>Manage your classes and track student progress</p>
        </div>
        <button
          onClick={() => navigate('/teacher/exercises/new')}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> Create Exercise
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Users size={24} color="#3b82f6" />
            <h3>Total Students</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalStudents}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BookOpen size={24} color="#10b981" />
            <h3>Total Exercises</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalExercises}</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <TrendingUp size={24} color="#f59e0b" />
            <h3>Avg Completion</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{avgCompletion}%</p>
        </div>
      </div>

      {/* Classes and Exercises */}
      {classes.map(classItem => (
        <div key={classItem.id} className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{classItem.name}</h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{classItem.students} students</p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Exercise</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submissions</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Avg Grade</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {classItem.exercises.map(exercise => (
                  <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{exercise.title}</td>
                    <td style={{ padding: '0.75rem' }}>{exercise.submissions}/{classItem.students}</td>
                    <td style={{ padding: '0.75rem' }}>{exercise.averageGrade}%</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => navigate(`/teacher/submissions/${exercise.id}`)}
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherDashboard;