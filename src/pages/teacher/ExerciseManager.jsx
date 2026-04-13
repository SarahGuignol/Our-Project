// Import React and the useState hook for managing local state
import React, { useState } from 'react';

// Import useNavigate to programmatically redirect the user to another route
import { useNavigate } from 'react-router-dom';

// Import icons from lucide-react:
// - Save: for the "Create Exercise" button inside the modal
// - X: for the close button of the modal
import { Save, X, Edit2, Trash2, Eye } from 'lucide-react';

// Define the ExerciseManager functional component
const ExerciseManager = () => {

  // Hook to navigate programmatically to another page
  const navigate = useNavigate();

  // State holding the list of existing exercises
  // Each exercise has: id, title, dueDate, and submissions count
  const [exercises, setExercises] = useState([
    { id: 1, title: 'Find Maximum Number', dueDate: '2024-01-20', submissions: 20, description: 'Find the max number in an array', starterCode: 'function findMax(numbers):\n    # Your code here' },
    { id: 2, title: 'Calculate Factorial', dueDate: '2024-01-25', submissions: 18, description: 'Calculate factorial of a number', starterCode: 'function factorial(n):\n    # Your code here' },
  ]);

  // State controlling whether the "Create Exercise" modal is visible or hidden
  // false = modal hidden, true = modal visible
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [newExercise, setNewExercise] = useState({
    title: '',        // Exercise title (required)
    description: '',  // Exercise instructions for students (required)
    dueDate: '',      // Deadline date (required)
    starterCode: '',  // Optional pre-filled code given to students
    solution: '',     // Optional expected solution visible only to the teacher
  });


  // Function called when the teacher clicks "Create Exercise" inside the modal
  const handleCreateExercise = () => {

    // Validate required fields before creating the exercise
    if (!newExercise.title || !newExercise.description || !newExercise.dueDate) {
      alert('Please fill in all required fields (Title, Description, Due Date)');
      return; // Stop here — do not create the exercise if any required field is empty
    }

    // Build the new exercise object to add to the list
    const exercise = {
      id: exercises.length + 1,  // Generate a simple incremental ID based on current list length
      ...newExercise,             // Spread all form fields (title, description, dueDate, starterCode, solution)
      submissions: 0,             // New exercises start with 0 submissions
    };

    // Add the new exercise to the existing list (spread old array + append new exercise)
    setExercises([...exercises, exercise]);

    // Hide the modal after successful creation
    setShowForm(false);

    // Reset all form fields back to empty so the form is clean for next use
    setNewExercise({ title: '', description: '', dueDate: '', starterCode: '', solution: '' });

    // Notify the teacher that the exercise was created successfully
    alert('✅ Exercise created successfully!');
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setNewExercise({
      title: exercise.title,
      description: exercise.description || '',
      dueDate: exercise.dueDate,
      starterCode: exercise.starterCode || '',
      solution: exercise.solution || '',
    });
    setShowForm(true);
  };

  const handleUpdateExercise = () => {
    const updatedExercises = exercises.map(ex => 
      ex.id === editingExercise.id 
        ? { ...ex, ...newExercise }
        : ex
    );
    setExercises(updatedExercises);
    setShowForm(false);
    setEditingExercise(null);
    setNewExercise({ title: '', description: '', dueDate: '', starterCode: '', solution: '' });
    alert('✅ Exercise updated successfully!');
  };

  const handleDeleteExercise = (id) => {
    if (window.confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) {
      const filteredExercises = exercises.filter(ex => ex.id !== id);
      setExercises(filteredExercises);
      alert('🗑️ Exercise deleted successfully!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExercise(null);
    setNewExercise({ title: '', description: '', dueDate: '', starterCode: '', solution: '' });
  };


  // ─── JSX / RENDER ────────────────────────────────────────────────────────────
  return (

    // Main page container with padding
    <div className="container" style={{ padding: '2rem' }}>

      {/* ── Page Header Row: title on the left, "New Exercise" button on the right ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>

        {/* Left side: page title and subtitle */}
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Exercise Manager</h1>
          <p style={{ color: '#6b7280' }}>Create and manage coding exercises</p>
        </div>

        {/* Button to open the "Create Exercise" modal by setting showForm to true */}
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          + New Exercise
        </button>
      </div>

      {/* ── Exercises Table Card ── */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>All Exercises</h2>

        {/* Horizontal scroll wrapper for the table on small screens */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>

            {/* Table header row */}
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Due Date</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Submissions</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Loop over the exercises array and render one row per exercise */}
              {exercises.map(exercise => (
                <tr key={exercise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{exercise.title}</td>
                  <td style={{ padding: '0.75rem' }}>{exercise.dueDate}</td>

                  {/* Number of submissions received for this exercise */}
                  <td style={{ padding: '0.75rem' }}>{exercise.submissions}</td>

                  {/* Action cell: button to navigate to the submissions review page */}
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {/* Bouton View Submissions */}
                      <button
                        onClick={() => navigate(`/teacher/submissions/${exercise.id}`)}
                        className="btn-secondary"
                        style={{ 
                          padding: '0.25rem 0.75rem', 
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        title="View Submissions"
                      >
                        <Eye size={14} /> View
                      </button>
                      
                      {/* Bouton Edit */}
                      <button
                        onClick={() => handleEditExercise(exercise)}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        title="Edit Exercise"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      
                      {/* Bouton Delete */}
                      <button
                        onClick={() => handleDeleteExercise(exercise.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        title="Delete Exercise"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      {/* Create/Edit Exercise Modal */}
      {showForm && (

        // Dark semi-transparent overlay covering the full screen behind the modal
        <div style={{
          position: 'fixed',   // Fixed positioning so it covers the entire viewport regardless of scroll
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)', // 50% black overlay to dim the background
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,        // High z-index to appear above all other page content
        }}>

          {/* Modal card container — limited width and max height with scroll */}
          <div className="card" style={{
            width: '600px',
            maxWidth: '90%',     // Responsive: shrinks on small screens
            maxHeight: '80vh',   // Limits height to 80% of viewport so it doesn't overflow
            overflow: 'auto'     // Allows scrolling inside the modal if content is tall
          }}>

            {/* ── Modal Header: title + close button ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {editingExercise ? 'Edit Exercise' : 'Create New Exercise'}
              </h2>
              <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* ── Modal Form Fields ── vertical stack with gap between each field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Field 1 — Title (required) */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title *</label>
                <input
                  type="text"
                  value={newExercise.title} // Controlled input bound to newExercise.title
                  onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
                  // Spread existing fields and update only title on each keystroke
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  placeholder="e.g., Find Maximum Number"
                />
              </div>

              {/* Field 2 — Description (required) */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description *</label>
                <textarea
                  value={newExercise.description}
                  onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                  // Spread existing fields and update only description on each keystroke
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', minHeight: '100px' }}
                  placeholder="Describe what students need to do..."
                />
              </div>

              {/* Field 3 — Due Date (required) */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Due Date *</label>
                <input
                  type="date"   // Renders a native date picker in the browser
                  value={newExercise.dueDate}
                  onChange={(e) => setNewExercise({ ...newExercise, dueDate: e.target.value })}
                  // Spread existing fields and update only dueDate on each keystroke
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>

              {/* Field 4 — Starter Code (optional) */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Starter Code (Optional)</label>
                <textarea
                  value={newExercise.starterCode}
                  onChange={(e) => setNewExercise({ ...newExercise, starterCode: e.target.value })}
                  // Spread existing fields and update only starterCode on each keystroke
                  style={{
                    width: '100%', padding: '0.5rem',
                    fontFamily: 'monospace',   // Monospace font to make code more readable
                    border: '1px solid #d1d5db', borderRadius: '0.375rem',
                    minHeight: '150px'         // Taller than regular textarea for code writing
                  }}
                  placeholder="function findMax(numbers):\n    # Write your code here\n    return max"
                />
              </div>

              {/* Field 5 — Expected Solution (optional, visible only to the teacher) */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expected Solution (Optional)</label>
                <textarea
                  value={newExercise.solution}
                  onChange={(e) => setNewExercise({ ...newExercise, solution: e.target.value })}
                  // Spread existing fields and update only solution on each keystroke
                  style={{
                    width: '100%', padding: '0.5rem',
                    fontFamily: 'monospace',
                    border: '1px solid #d1d5db', borderRadius: '0.375rem',
                    minHeight: '150px'
                  }}
                  placeholder="function findMax(numbers):\n    max = numbers[0]\n    for each num in numbers:\n        if num > max:\n            max = num\n    return max"
                />
              </div>

              {/* ── Modal Action Buttons ── */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                <button 
                  onClick={editingExercise ? handleUpdateExercise : handleCreateExercise} 
                  className="btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Save size={20} />
                  {editingExercise ? 'Update Exercise' : 'Create Exercise'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the component so it can be imported and used in the router (e.g. App.jsx)
export default ExerciseManager;