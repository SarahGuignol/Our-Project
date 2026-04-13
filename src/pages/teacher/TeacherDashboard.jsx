// Import React and the useState hook for managing local state
import React, { useState } from 'react';

// Import useNavigate to programmatically redirect the user to another route
import { useNavigate } from 'react-router-dom';

// Import icons from lucide-react:
// - Users: for the total students stat card
// - BookOpen: for the total exercises stat card
// - TrendingUp: for the average completion stat card
// - Plus: for the "Create Exercise" button
import { Users, BookOpen, TrendingUp, Plus } from 'lucide-react';

// Define the TeacherDashboard functional component
const TeacherDashboard = () => {

  // Hook to navigate programmatically to another page
  const navigate = useNavigate();

  // State holding the list of classes — setter is omitted since data never changes here
  // Each class has: id, name, number of students, and an array of exercises
  // Each exercise inside a class has: id, title, submissions count, and averageGrade
  const [classes] = useState([
    {
      id: 1,
      name: 'CS101 - Programming Fundamentals', // Class name displayed in the UI
      students: 25,                              // Total number of students in this class
      exercises: [
        { id: 1, title: 'Find Maximum Number', submissions: 20, averageGrade: 78 },
        { id: 2, title: 'Calculate Factorial',  submissions: 18, averageGrade: 82 },
      ],
    },
    {
      id: 2,
      name: 'CS201 - Data Structures',
      students: 20,
      exercises: [
        { id: 3, title: 'Bubble Sort',    submissions: 15, averageGrade: 75 },
        { id: 4, title: 'Binary Search',  submissions: 12, averageGrade: 80 },
      ],
    },
  ]);

  // Calculate total students across all classes by summing each class's student count
  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);

  // Calculate total exercises across all classes by summing each class's exercises array length
  const totalExercises = classes.reduce((sum, c) => sum + c.exercises.length, 0);
  const avgCompletion = Math.round(
        classes.reduce((sum, c) => {
          // For each class, calculate the ratio of total submissions to total possible submissions
          const classSubmissions = c.exercises.reduce((s, e) => s + e.submissions, 0);
          const classTotal = c.exercises.length * c.students;
          return sum + (classSubmissions / classTotal) * 100;
        }, 0) / classes.length // Divide by number of classes to get the average
      );
  return (

    // Main page container with padding
    <div className="container" style={{ padding: '2rem' }}>

      {/* ── Page Header Row: title on the left, "Create Exercise" button on the right ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>

        {/* Left side: page title and subtitle */}
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Teacher Dashboard</h1>
          <p style={{ color: '#6b7280' }}>Manage your classes and track student progress</p>
        </div>

        {/* Right side: button to navigate to the create exercise page */}
        <button
          onClick={() => navigate('/teacher/exercises/new')} // Redirect to the new exercise form
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {/* Plus icon before the button label */}
          <Plus size={20} /> Create Exercise
        </button>
      </div>

      {/* ── Quick Stats Grid ── */}
      {/* Responsive grid: each card is at least 200px wide, fills available space */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>

        {/* Stat card 1 — Total number of students across all classes */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {/* Users icon in blue */}
            <Users size={24} color="#3b82f6" />
            <h3>Total Students</h3>
          </div>
          {/* Display the computed total students value */}
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalStudents}</p>
        </div>

        {/* Stat card 2 — Total number of exercises across all classes */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {/* BookOpen icon in green */}
            <BookOpen size={24} color="#10b981" />
            <h3>Total Exercises</h3>
          </div>
          {/* Display the computed total exercises value */}
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalExercises}</p>
        </div>

        {/* Stat card 3 — Average completion percentage (hardcoded) */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {/* TrendingUp icon in amber/yellow */}
            <TrendingUp size={24} color="#f59e0b" />
            <h3>Avg Completion</h3>
          </div>
          {/* Display the hardcoded average completion percentage */}
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{avgCompletion}%</p>
        </div>
      </div>

      {/* ── Classes and Exercises Section ── */}
      {/* Loop over each class and render a card with its exercises table */}
      {classes.map(classItem => (

        // Card for a single class — key is required by React to uniquely identify each item
        <div key={classItem.id} className="card" style={{ marginBottom: '1.5rem' }}>

          {/* Class name as the card title */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            {classItem.name}
          </h2>

          {/* Number of students in this class displayed in gray */}
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{classItem.students} students</p>

          {/* Horizontal scroll wrapper for the table on small screens */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>

              {/* Table header row */}
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Exercise</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submissions</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Avg Grade</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* Loop over each exercise inside this class and render one table row */}
                {classItem.exercises.map(exercise => (

                  // Row for a single exercise — key uses exercise id to uniquely identify it
                  <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>

                    {/* Exercise title */}
                    <td style={{ padding: '0.75rem' }}>{exercise.title}</td>

                    {/* Submissions count shown as "submitted / total students" (e.g. "20/25") */}
                    <td style={{ padding: '0.75rem' }}>{exercise.submissions}/{classItem.students}</td>

                    {/* Average grade for this exercise as a percentage */}
                    <td style={{ padding: '0.75rem' }}>{exercise.averageGrade}%</td>

                    {/* Action cell: button to navigate to the submissions review page for this exercise */}
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        // Navigate to the review page passing the exercise ID in the URL
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

// Export the component so it can be imported and used in the router (e.g. App.jsx)
export default TeacherDashboard;