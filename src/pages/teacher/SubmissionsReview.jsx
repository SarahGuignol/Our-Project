// Import React and the useState hook for managing local state
import React, { useState } from 'react';

// Import useParams to read dynamic parameters from the URL (e.g. /teacher/submissions/3 → exerciseId = '3')
import { useParams } from 'react-router-dom';

// Import icons from lucide-react:
// - Send: for the "Save Feedback" button
// - Star: imported but never used (can be removed)
import { Send } from 'lucide-react';

// Define the SubmissionsReview functional component
const SubmissionsReview = () => {

  // Extract the exerciseId from the URL parameters (e.g. /teacher/submissions/3 → exerciseId = '3')
  const { exerciseId } = useParams();

  // State holding the list of students and their submissions
  // Each student has: id, name, code (their pseudocode), aiFeedback, comment, and grade
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      // The student's submitted pseudocode (multiline string using \n for line breaks)
      code: 'function findMax(numbers):\n    max = numbers[0]\n    for num in numbers:\n        if num > max:\n            max = num\n    return max',
      // AI-generated feedback on this student's code
      aiFeedback: 'Good approach! Consider edge cases like empty array.',
      comment: '',   // Teacher's comment, initially empty
      grade: null,   // Grade not yet assigned
    },
    {
      id: 2,
      name: 'Jane Smith',
      code: 'function findMax(numbers):\n    return max(numbers)  # Using built-in',
      aiFeedback: 'This uses a built-in function. Try implementing the logic yourself.',
      comment: '',
      grade: null,
    },
  ]);

  // State holding the currently selected student — defaults to the first student in the list
  const [selectedStudent, setSelectedStudent] = useState(students[0]);

  // State holding the teacher's comment input value, initialized to empty string
  const [comment, setComment] = useState('');

  // State holding the grade input value as a string (number inputs work better as strings in React)
  const [grade, setGrade] = useState('');


  // Function called when the teacher clicks "Save Feedback"
  const handleSaveFeedback = () => {

    // ✅ STEP 1 — Validate FIRST before doing anything else
    const parsedGrade = parseInt(grade);
    if (parsedGrade < 0 || parsedGrade > 100) {
      alert('Grade must be between 0 and 100');
      return; // Stop here — do not save anything if grade is invalid
    }

    // STEP 2 — Only reached if validation passed
    // Loop over all students and update only the selected student's comment and grade
    const updatedStudents = students.map(s =>
      s.id === selectedStudent.id
        ? {
            ...s,            // Keep all existing fields unchanged
            comment,         // Overwrite comment with current input
            grade: parsedGrade // Use the already parsed grade (no need to parseInt again)
          }
        : s // Leave all other students unchanged
    );

    // STEP 3 — Update the students list state with the new saved feedback
    setStudents(updatedStudents);

    // STEP 4 — Update the selectedStudent state so the UI reflects changes immediately
    setSelectedStudent({
      ...selectedStudent,  // Keep existing selected student data
      comment,             // Update comment
      grade: parsedGrade   // Update grade using the already parsed value
    });

    // STEP 5 — Notify the teacher that feedback was saved successfully
    alert('Feedback saved successfully!');
 };

  // ─── JSX / RENDER ────────────────────────────────────────────────────────────
  return (

    // Main container: full viewport height minus the 64px navbar
    <div style={{ height: 'calc(100vh - 64px)', padding: '1rem' }}>

      {/* Page title showing the exercise ID from the URL */}
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Review Submissions - Exercise #{exerciseId}
      </h1>

      {/* Two-column layout: fixed 300px student list on the left, flexible detail panel on the right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',            // Left panel is fixed width, right takes remaining space
        gap: '1rem',
        height: 'calc(100% - 60px)'                  // Remaining height after the page title
      }}>

        {/* ── Left Panel: Student List ── */}
        <div className="card" style={{ overflow: 'auto' }}> {/* Scrollable if list is long */}
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Students</h3>

          {/* Vertical list of student buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

            {/* Loop over students and render one button per student */}
            {students.map(student => (
              <button
                key={student.id} // Unique React key for each list item
                onClick={() => {
                  // Set the clicked student as the selected one to show their details
                  setSelectedStudent(student);
                  // Pre-fill the comment input with this student's saved comment (or empty)
                  setComment(student.comment || '');
                  // Pre-fill the grade input with this student's saved grade (converted to string, or empty)
                  setGrade(student.grade ? student.grade.toString() : '');
                }}
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  // Highlight the button in light blue if this student is currently selected
                  background: selectedStudent.id === student.id ? '#eff6ff' : 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                {/* Student's name in bold */}
                <div style={{ fontWeight: '500' }}>{student.name}</div>

                {/* Show the grade in green only if a grade has been assigned */}
                {student.grade && (
                  <div style={{ fontSize: '0.875rem', color: '#10b981' }}>
                    Grade: {student.grade}%
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right Panel: Selected Student's Submission Details ── */}
        <div className="card" style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Panel title showing the selected student's name */}
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>{selectedStudent.name}'s Submission</h3>

          {/* ── Pseudocode Block ── */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Pseudo-code:</h4>
            {/* <pre> preserves whitespace and line breaks in the code string */}
            <pre style={{
              background: '#1e1e1e',       // Dark editor-like background
              color: '#d4d4d4',            // Light gray text like VS Code
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',            // Scroll if code is wider than the panel
              fontFamily: 'monospace',     // Monospace font for code readability
              fontSize: '0.875rem',
            }}>
              {/* Display the selected student's submitted code */}
              {selectedStudent.code}
            </pre>
          </div>

          {/* ── AI Feedback Block ── */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>AI-generated Feedback:</h4>
            <div style={{
              background: '#f3f4f6',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              borderLeft: '4px solid #3b82f6', // Blue left border to visually highlight AI feedback
            }}>
              {/* Display the AI-generated feedback for the selected student */}
              {selectedStudent.aiFeedback}
            </div>
          </div>

          {/* ── Teacher Comment Textarea ── */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Teacher's Comment:</h4>
            <textarea
              value={comment}                            // Controlled input bound to comment state
              onChange={(e) => setComment(e.target.value)} // Update state on every keystroke
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                minHeight: '100px',                      // Minimum height for comfortable writing
                fontFamily: 'inherit',                   // Matches the rest of the UI font
              }}
              placeholder="Add your personal feedback here..."
            />
          </div>

          {/* ── Grade Input ── */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Grade (%):</h4>
            <input
              type="number"                              // Number input to restrict to numeric values
              value={grade}                              // Controlled input bound to grade state
              onChange={(e) => setGrade(e.target.value)} // Update state on every keystroke
              style={{
                width: '100px',                          // Small fixed width since grade is max 3 digits
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
              }}
              min="0"    // Minimum allowed grade value
              max="100"  // Maximum allowed grade value
            />
          </div>

          {/* ── Save Feedback Button ── */}
          <button
            onClick={handleSaveFeedback} // Call handleSaveFeedback when clicked
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {/* Send icon before the button label */}
            <Send size={18} /> Save Feedback
          </button>

        </div>
      </div>
    </div>
  );
};

// Export the component so it can be imported and used in the router (e.g. App.jsx)
export default SubmissionsReview;