// Import React and the useState hook for managing local state
import React, { useState } from 'react';

// Import icons from lucide-react:
// - Clock: to display the submission date
// - CheckCircle: imported but not used (can be removed)
// - MessageCircle: to indicate the teacher's feedback section
// - Award: to display the grade with a trophy icon
import { Clock, MessageCircle, Award } from 'lucide-react';

// Define the StudentHistory functional component
const StudentHistory = () => {

  // State holding the list of past submissions — setter is omitted since data never changes here
  // Each submission has: id, exerciseTitle, submittedAt, grade, teacherComment, and status
  const [submissions] = useState([
    {
      id: 1,
      exerciseTitle: 'Find Maximum Number',  // Title of the exercise that was submitted
      submittedAt: '2024-01-15',             // Date the submission was made
      grade: 85,                             // Grade given by the teacher (out of 100)
      teacherComment: 'Good work! Consider handling empty arrays.', // Teacher's written feedback
      status: 'graded',                      // Current status of the submission
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


  // ─── JSX / RENDER ────────────────────────────────────────────────────────────
  return (

    // Main page container with padding
    <div className="container" style={{ padding: '2rem' }}>

      {/* Page title */}
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Submission History</h1>

      {/* Page subtitle in gray */}
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>View your past submissions and feedback</p>

      {/* Vertical list of submission cards with a gap between each card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Loop over the submissions array and render one card per submission */}
        {submissions.map(submission => (

          // Card container — key is required by React to uniquely identify each item in the list
          <div key={submission.id} className="card">

            {/* ── Card Top Row: title + date on the left, grade on the right ── */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between', // Push left group and grade to opposite ends
              alignItems: 'start',             // Align both sides to the top
              marginBottom: '1rem'
            }}>

              {/* Left side: exercise title and submission date */}
              <div>
                {/* Exercise title in bold */}
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {submission.exerciseTitle}
                </h3>

                {/* Submission date with a clock icon, displayed in gray small text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  {/* Clock icon indicating a date/time value */}
                  <Clock size={14} />
                  <span>Submitted: {submission.submittedAt}</span>
                </div>
              </div>

              {/* Right side: award icon + grade percentage */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Trophy/award icon in amber/yellow */}
                <Award size={20} color="#f59e0b" />
                {/* Grade value displayed large and bold in dark color */}
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {submission.grade}%
                </span>
              </div>
            </div>

            {/* ── Teacher Feedback Block ── */}
            {/* Only rendered if the submission has a teacherComment (not null/empty) */}
            {submission.teacherComment && (
              <div style={{
                background: '#f3f4f6',    // Light gray background to visually separate feedback
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginTop: '0.5rem',
              }}>

                {/* Feedback header: icon + label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {/* Message bubble icon in blue */}
                  <MessageCircle size={16} color="#3b82f6" />
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>Teacher's Feedback:</span>
                </div>

                {/* The actual feedback text from the teacher */}
                <p style={{ color: '#374151', fontSize: '0.875rem' }}>
                  {submission.teacherComment}
                </p>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component so it can be imported and used in the router (e.g. App.jsx)
export default StudentHistory;