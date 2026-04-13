// Import React and the useState hook for managing local state
import React, { useState } from 'react';

// Import chart components from the recharts library:
// - BarChart: the main chart container for bar charts
// - Bar: renders individual bar series inside the chart
// - XAxis: the horizontal axis showing exercise names
// - YAxis: the vertical axis showing numeric values
// - CartesianGrid: background grid lines for readability
// - Tooltip: popup showing exact values when hovering over a bar
// - Legend: labels identifying each bar color/series
// - ResponsiveContainer: makes the chart resize to fit its parent container
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Import icons from lucide-react:
// - AlertTriangle: warning icon for the "struggling students" section
// - TrendingUp: imported but never used (can be removed)
// - Users: imported but never used (can be removed)
import { AlertTriangle } from 'lucide-react';

// Define the Analytics functional component
const Analytics = () => {

  // State holding the exercise completion data used to render the bar chart
  // Each entry has: name (exercise label), completed (number of students who finished), total (class size)
  // Setter is omitted since the data never changes here
  const [completionData] = useState([
    { name: 'Find Max',       completed: 20, total: 25 },
    { name: 'Factorial',      completed: 18, total: 25 },
    { name: 'Bubble Sort',    completed: 15, total: 20 },
    { name: 'Binary Search',  completed: 12, total: 20 },
  ]);

  // State holding the list of students who may need extra help
  // Each entry has: name, errors (number of errors made), complexity (algorithm complexity score)
  // Setter is omitted since the data never changes here
  // Add a unique id to each student object and use that instead
  const [strugglingStudents] = useState([
    { id: 1, name: 'John Doe',    errors: 12, complexity: 'O(n²)'      },
    { id: 2, name: 'Alice Brown', errors: 8,  complexity: 'O(n²)'      },
    { id: 3, name: 'Bob Wilson',  errors: 7,  complexity: 'O(n log n)' },
  ]);


  // ─── JSX / RENDER ────────────────────────────────────────────────────────────
  return (

    // Main page container with padding
    <div className="container" style={{ padding: '2rem' }}>

      {/* Page title */}
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Analytics Dashboard</h1>

      {/* Page subtitle in gray */}
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Track student progress and identify learning patterns</p>

      {/* ── Bar Chart Card ── */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Exercise Completion Rates</h2>

        {/* Fixed height container required by recharts to render correctly */}
        <div style={{ height: '400px' }}>

          {/* ResponsiveContainer makes the chart fill 100% of the parent div's width and height */}
          <ResponsiveContainer width="100%" height="100%">

            {/* BarChart receives the completionData array — each object becomes a group of bars */}
            <BarChart data={completionData}>

              {/* Background grid lines with a dashed pattern (3px dash, 3px gap) */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* X axis labels come from the 'name' field of each data object */}
              <XAxis dataKey="name" />

              {/* Y axis shows numeric values (auto-scaled to the data range) */}
              <YAxis />

              {/* Tooltip popup shows exact values when the user hovers over a bar */}
              <Tooltip />

              {/* Legend shows color labels for each bar series at the bottom of the chart */}
              <Legend />

              {/* Blue bar series representing the number of students who completed the exercise */}
              <Bar dataKey="completed" fill="#3b82f6" name="Completed" />

              {/* Gray bar series representing the total number of students in the class */}
              <Bar dataKey="total" fill="#9ca3af" name="Total Students" />

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Struggling Students Card ── */}
      <div className="card">

        {/* Card header: warning icon + title side by side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          {/* Yellow warning triangle icon to visually signal attention needed */}
          <AlertTriangle size={24} color="#f59e0b" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Students Who May Need Extra Help</h2>
        </div>

        {/* Horizontal scroll wrapper for the table on small screens */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>

            {/* Table header row */}
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Student Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Error Count</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Complexity Score</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Loop over strugglingStudents and render one row per student */}
              {strugglingStudents.map(student => (

                // Row keyed by student name — note: using name as key can cause issues
                // if two students share the same name (see note below)
                <tr key={student.id} style={{ borderBottom: '1px solid #e5e7eb' }}>

                  {/* Student's full name */}
                  <td style={{ padding: '0.75rem' }}>{student.name}</td>

                  {/* Error count displayed in red bold to visually highlight the problem */}
                  <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: '600' }}>
                    {student.errors}
                  </td>

                  {/* Algorithm complexity displayed in monospace font (e.g. O(n²), O(n log n)) */}
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>
                    {student.complexity}
                  </td>

                  {/* Action cell: button to review this student's work */}
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                    >
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

// Export the component so it can be imported and used in the router (e.g. App.jsx)
export default Analytics;