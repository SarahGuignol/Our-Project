// Import React and hooks: useState for state management, useEffect for side effects
import React, { useState, useEffect } from 'react';

// Import useParams to read URL parameters (mode, id) and useNavigate to redirect programmatically
import { useParams, useNavigate } from 'react-router-dom';

// Import the CodeEditor component (the left panel where user writes pseudocode)
import CodeEditor from '../../components/CodeEditor';

// Import the OutputPanel component (the right panel showing results, complexity, AI help)
import OutputPanel from '../../components/OutputPanel';

// Import three utility functions from the pseudocode parser:
// - executePseudocode: runs the code and returns output + variables
// - analyzeComplexity: analyzes time/space complexity of the code
// - getAIHelp: generates AI suggestions based on code and output
import { executePseudocode, analyzeComplexity, getAIHelp } from '../../utils/pseudocodeParser';

// Define the CodingScreen functional component
const CodingScreen = () => {

  // Extract 'mode' and 'id' from the URL (e.g. /coding/exercise/3 → mode='exercise', id='3')
  const { mode, id } = useParams();

  // Hook to programmatically navigate to another page
  const navigate = useNavigate();

  // State to hold the current code written by the user in the editor, initialized to empty string
  const [code, setCode] = useState('');

  // State to hold the output result after running the code, initialized to empty string
  const [output, setOutput] = useState('');

  // State to hold the complexity analysis result (e.g. "O(n)"), initialized to empty string
  const [complexity, setComplexity] = useState('');

  // State to hold the AI-generated help/suggestions text, initialized to empty string
  const [aiHelp, setAiHelp] = useState('');

  // State to hold the list of variables tracked during code execution, initialized to empty array
  const [variables, setVariables] = useState([]);

  // State to track whether the exercise is currently being submitted (shows loading state)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Boolean: true if the current mode is 'exercise', false if it's free coding mode
  const isExercise = mode === 'exercise';

  // State to hold the exercise data — only populated if in exercise mode
  // The exercise object is hardcoded here as a placeholder (would normally come from an API)
  const [exercise] = useState(isExercise ? {
    id: id,                                        // The exercise ID taken from the URL
    title: 'Find Maximum Number',                  // Display title of the exercise
    description: 'Write a function that finds the maximum number in an array.', // Instructions shown to user
    starterCode: 'function findMax(numbers):\n    # Write your code here\n    return max' // Pre-filled code template
  } : null); // If not in exercise mode, exercise is null

  // Side effect: when the component loads in exercise mode, pre-fill the editor with the starter code
  useEffect(() => {
    // Only set the starter code if we are in exercise mode AND the exercise has starter code
    if (isExercise && exercise?.starterCode) {
      setCode(exercise.starterCode); // Load the starter code into the editor
    }
  }, [isExercise, exercise]); // Re-runs only if isExercise or exercise changes


  // ─── HANDLERS ───────────────────────────────────────────────────────────────

  // Called when the user clicks the "Run" button in the CodeEditor
  const handleRunCode = () => {

    // Execute the pseudocode and get back the output text and tracked variables
    const result = executePseudocode(code);

    // Update the output state with the execution result text
    setOutput(result.output);

    // Update the variables state with the list of variables tracked during execution (default to empty array)
    setVariables(result.variables || []);

    // Analyze the code's time/space complexity and store the result
    const complexityResult = analyzeComplexity(code);
    setComplexity(complexityResult);

    // Get AI-generated help based on the code, its output, and the variables
    const aiHelpResult = getAIHelp(code, result.output, result.variables);
    setAiHelp(aiHelpResult);
  };

  // Called when the user clicks the "Submit Exercise" button
  const handleSubmit = /*async*/ () => {      // we do not need async because it uses setTimeout which does not need it

    // Set submitting state to true to disable the button and show "Submitting..." text
    setIsSubmitting(true);

    // Simulate an API submission call with a 1.5 second delay
    setTimeout(() => {
      alert('Exercise submitted successfully!'); // Notify the user of success
      setIsSubmitting(false);                    // Reset the submitting state
      navigate('/student/dashboard');            // Redirect the user back to the dashboard
    }, 1500); // 1500 milliseconds = 1.5 seconds delay
  };


  // ─── JSX / RENDER ────────────────────────────────────────────────────────────

  return (
    // Main container — height fills the viewport minus the 64px top navbar
    <div style={{ height: 'calc(100vh - 64px)', padding: '1rem' }}>

      {/* Exercise header card — only rendered when in exercise mode and exercise data exists */}
      {isExercise && exercise && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          {/* Exercise title */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            {exercise.title}
          </h2>
          {/* Exercise description/instructions */}
          <p style={{ color: '#6b7280' }}>{exercise.description}</p>
        </div>
      )}

      {/* Two-column grid layout: CodeEditor on the left, OutputPanel on the right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Two equal-width columns
        gap: '1rem',
        height: 'calc(100% - 100px)', // Fill remaining height minus header card and submit button area
      }}>

        {/* Left panel: the code editor where the user writes pseudocode */}
        {/* - code: current code value */}
        {/* - setCode: function to update the code state on every edit */}
        {/* - onRun: function called when the user clicks Run inside the editor */}
        <CodeEditor code={code} setCode={setCode} onRun={handleRunCode} />

        {/* Right panel: displays execution output, complexity, AI help, and variable tracking */}
        <OutputPanel
          output={output}         // The text result from running the code
          complexity={complexity} // The complexity analysis string (e.g. "O(n)")
          aiHelp={aiHelp}         // AI-generated suggestions and feedback
          variables={variables}   // List of variables tracked during execution
        />
      </div>

      {/* Submit button row — only shown when in exercise mode */}
      {isExercise && (
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSubmit}   // Trigger the submit handler on click
            disabled={isSubmitting}  // Disable the button while submission is in progress
            className="btn-primary"
            style={{
              background: '#10b981',                   // Green color to distinguish from default blue
              padding: '0.75rem 2rem',
              opacity: isSubmitting ? 0.5 : 1,         // Dim the button visually while submitting
            }}
          >
            {/* Button label changes based on submission state */}
            {isSubmitting ? 'Submitting...' : 'Submit Exercise'}
          </button>
        </div>
      )}
    </div>
  );
};

// Export the component so it can be used in the router (e.g. App.jsx)
export default CodingScreen;