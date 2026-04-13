// Import React and the useState hook for managing local state
import React, { useState } from 'react';

// Import useNavigate to programmatically redirect the user to another route
import { useNavigate } from 'react-router-dom';

// Import icons from lucide-react used throughout the dashboard
import { BookOpen, Clock, CheckCircle, Circle, Plus, TrendingUp, Award } from 'lucide-react';

// Define the StudentDashboard functional component
const StudentDashboard = () => {

  // Hook to navigate programmatically to another page
  const navigate = useNavigate();

  // State holding the list of exercises — setter is omitted since the data never changes here
  // Each exercise has: id, title, dueDate, status ('completed'/'pending'/'not_started'), and grade
  const [exercises] = useState([
    { id: 1, title: 'Find Maximum Number',        dueDate: '2024-01-20', status: 'completed',  grade: 85   },
    { id: 2, title: 'Calculate Factorial',         dueDate: '2024-01-25', status: 'pending',    grade: null },
    { id: 3, title: 'Bubble Sort Algorithm',       dueDate: '2024-01-30', status: 'pending',    grade: null },
    { id: 4, title: 'Binary Search Implementation',dueDate: '2024-02-05', status: 'not_started',grade: null },
  ]);

  // Compute quick stats derived directly from the exercises array (no extra state needed)
  const stats = {
    // Count how many exercises have status 'completed'
    completed: exercises.filter(e => e.status === 'completed').length,

    // Count how many exercises have status 'pending'
    pending: exercises.filter(e => e.status === 'pending').length,

    // Hardcoded average grade (would normally be calculated from real data)
    averageGrade: 85,

    // Hardcoded streak value in days (would normally come from a backend)
    streak: 15
  };

  // Function to navigate to the coding screen based on mode
  // isFreeMode = true → free coding, isFreeMode = false → specific exercise by ID
  const handleStartExercise = (exerciseId, isFreeMode = false) => {
    if (isFreeMode) {
      // Navigate to the free coding screen (no specific exercise)
      navigate('/student/coding/free');
    } else {
      // Navigate to the exercise coding screen with the exercise ID in the URL
      navigate(`/student/coding/exercise/${exerciseId}`);
    }
  };

  // Returns the appropriate icon component based on the exercise status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={20} color="#10b981" />; // Green checkmark
      case 'pending':   return <Clock       size={20} color="#f59e0b" />; // Yellow clock
      default:          return <Circle      size={20} color="#9ca3af" />; // Gray empty circle
    }
  };

  // Returns a human-readable status label based on the exercise status string
  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'pending':   return 'Pending Review';
      default:          return 'Not Started';
    }
  };


  // ─── JSX / RENDER ────────────────────────────────────────────────────────────
  return (

    // Main page container with padding
    <div className="container" style={{ padding: '2rem' }}>

      {/* ── Welcome Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple gradient
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white'
      }}>
        {/* Welcome message with emoji */}
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome back, Student! 👋</h1>
        {/* Subtitle encouraging the student */}
        <p>Continue your coding journey and master algorithms with AI assistance.</p>
      </div>

      {/* ── Quick Stats Grid ── */}
      {/* Responsive grid: each card is at least 200px wide, fills available space */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>

        {/* Stat card 1 — Exercises completed out of total */}
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
          {/* BookOpen icon in blue */}
          <BookOpen size={24} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
          {/* Shows completed count / total exercises (e.g. "1/4") */}
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.completed}/{exercises.length}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Exercises Done</div>
        </div>

        {/* Stat card 2 — Average grade percentage */}
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
          {/* Award icon in yellow/amber */}
          <Award size={24} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          {/* Displays the hardcoded average grade */}
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageGrade}%</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Average Grade</div>
        </div>

        {/* Stat card 3 — Current day streak */}
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
          {/* TrendingUp icon in green */}
          <TrendingUp size={24} color="#10b981" style={{ marginBottom: '0.5rem' }} />
          {/* Displays the hardcoded streak count */}
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.streak}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Day Streak 🔥</div>
        </div>
      </div>

      {/* ── Section Header with "Start New" button ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        {/* Section title */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Your Exercises</h2>

        {/* Button to start a new free-mode coding session */}
        {/* Calls handleStartExercise with null ID and isFreeMode = true */}
        <button
          onClick={() => handleStartExercise(null, true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> Start New
        </button>
      </div>

      {/* ── Exercises Table ── */}
      <div className="card">
        {/* overflowX: auto makes the table scroll horizontally on small screens */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>

            {/* Table header row */}
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {/* Column headers styled in gray with medium font weight */}
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Due Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Grade</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Loop over the exercises array and render one row per exercise */}
              {exercises.map(exercise => (
                <tr
                  key={exercise.id} // Unique React key to identify each row in the list
                  style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}
                  // Highlight row in light gray when hovered
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  // Remove highlight when mouse leaves
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Exercise title in bold */}
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{exercise.title}</td>

                  {/* Due date displayed in gray */}
                  <td style={{ padding: '0.75rem', color: '#6b7280' }}>{exercise.dueDate}</td>

                  {/* Status cell: icon + text label side by side */}
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Icon determined by getStatusIcon based on exercise.status */}
                      {getStatusIcon(exercise.status)}
                      {/* Text label determined by getStatusText based on exercise.status */}
                      <span style={{ fontSize: '0.875rem' }}>{getStatusText(exercise.status)}</span>
                    </div>
                  </td>

                  {/* Grade cell: shows percentage if grade exists, dash '-' if null */}
                  <td style={{ padding: '0.75rem', fontWeight: '600' }}>
                    {exercise.grade ? `${exercise.grade}%` : '-'}
                  </td>

                  {/* Action cell: button to start or review the exercise */}
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      // Navigate to the exercise coding screen with this exercise's ID
                      onClick={() => handleStartExercise(exercise.id)}
                      className="btn-primary"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                    >
                      {/* Show 'Review' if already completed, 'Start' otherwise */}
                      {exercise.status === 'completed' ? 'Review' : 'Start'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Motivation Quote Banner ── */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        textAlign: 'center',
        background: '#fef3c7',  // Light yellow background
        borderRadius: '0.5rem',
        color: '#92400e'        // Dark amber text color
      }}>
        {/* Inspirational programming quote */}
        <p>💡 "The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie</p>
      </div>
    </div>
  );
};

// Export the component so it can be used in the router (e.g. App.jsx)
export default StudentDashboard;