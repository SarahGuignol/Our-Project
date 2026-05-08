import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CodeEditor from '../../components/CodeEditor';
import OutputPanel from '../../components/OutputPanel';
import { api } from '../../services/api';  // api services
import { Save, X, Edit2 } from 'lucide-react';

const CodingScreen = () => {
  const { mode, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [complexity, setComplexity] = useState('');
  const [aiHelp, setAiHelp] = useState('');
  const [variables, setVariables] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [hasRunOnce, setHasRunOnce] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [currentExerciseId, setCurrentExerciseId] = useState(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [savedExercises, setSavedExercises] = useState([]);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [hasPromptedSave, setHasPromptedSave] = useState(false);
  const [exerciseDescription, setExerciseDescription] = useState('');
  const [starterCode, setStarterCode] = useState(''); 


  const isExercise = mode === 'exercise';
  const isFreeMode = mode === 'free';

  const [exercise] = useState(isExercise ? {} : null);

  const toggleOutput = () => {
    setShowOutput(!showOutput);
  };

  useEffect(() => {
    if (isFreeMode) {
      loadSavedExercises();
      if (id) {
        loadExerciseById(id);
      }
    }
  }, [isFreeMode, id]);

  useEffect(() => {
    if (isExercise && id) {
      console.log("isExercise=true, id=", id);  // Debug
      loadExerciseFromAPI(id);
    }
  }, [isExercise, id]);

  useEffect(() => {
    if (isExercise && id) {
      loadExerciseData(id);
    }
  }, [isExercise, id]);

  const loadExerciseData = async (exerciseId) => {
    try {
      const data = await api.getExercise(exerciseId);
      if (data) {
        setCode(data.starter_code || '# Write your code here\n');
        setExerciseTitle(data.title);
      }
    } catch (error) {
      console.log('Could not load exercise data');
      if (exercise?.starterCode) {
        setCode(exercise.starterCode);
      }
    }
  };

  const loadExerciseFromAPI = async (exerciseId) => {
    console.log("Loading exercise ID:", exerciseId);  // Debug
    try {
      const exercise = await api.getExercise(parseInt(exerciseId));
      console.log("Exercise loaded:", exercise);  // Debug
      
      if (exercise) {
        // Set the starter code in the editor
        const starterCodeText = exercise.starter_code || '# Write your code here\n';
        console.log("Starter code:", starterCodeText);  // Debug
        setCode(starterCodeText);
        setExerciseTitle(exercise.title);
        setExerciseDescription(exercise.description || '');
        setStarterCode(exercise.starter_code || '');
      } else {
        console.log("Exercise not found");
        setCode('# Exercise not found\n# Please contact your teacher');
      }
    } catch (error) {
      console.error('Could not load exercise:', error);
      setCode('# Error loading exercise\n# Please try again later');
    }
  };

  const loadSavedExercises = async () => {
    try {
      const userId = user?.id || 1;
      const data = await api.getFreeExercises(userId);
      setSavedExercises(data);
    } catch (error) {
      console.log('Could not load saved exercises');
    }
  };

  const loadExerciseById = async (exerciseId) => {
    try {
      const data = await api.getFreeExercises(user?.id || 1);
      const exercise = data.find(ex => ex.id === parseInt(exerciseId) || ex.id === exerciseId);
      if (exercise) {
        setCode(exercise.code);
        setExerciseTitle(exercise.title);
        setCurrentExerciseId(exercise.id);
        setIsEditingExisting(true);
        setHasRunOnce(true);
      }
    } catch (error) {
      console.log('Could not load exercise');
    }
  };

  const handleSaveExercise = async () => {
    if (!exerciseTitle.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      const userId = user?.id || 1;
      const result = await api.saveFreeExercise(userId, exerciseTitle, code);
      
      if (result.success) {
        setCurrentExerciseId(result.id);
        setIsEditingExisting(true);
        setShowSaveDialog(false);
        setHasPromptedSave(true);
        await loadSavedExercises();
        alert(`Exercise "${exerciseTitle}" saved!`);
      } else {
        alert('Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleUpdateExercise = async () => {
    try {
      await api.updateFreeExercise(currentExerciseId, {
        student_id: user?.id || 1,
        title: exerciseTitle,
        code: code
      });
      alert(`Exercise "${exerciseTitle}" updated!`);
      await loadSavedExercises();
    } catch (error) {
      alert('Failed to update exercise');
    }
  };

  const handleRunCode = async () => {
    console.log("Running code:", code);
    try {
      const result = await api.analyzeCode(code);
      
      if (result.execution) {
        setOutput(result.execution.outputs?.join('\n') || 'No output');
        setVariables(result.execution.steps || []);
      }
      
      if (result.complexity) {
        setComplexity(result.complexity.big_o || 'N/A');
      }
      
      let feedback = '';
      if (result.complexity?.big_o) {
        feedback += `Time Complexity: ${result.complexity.big_o}\n`;
      }
      if (result.variables?.undefined?.length > 0) {
        feedback += `Undefined variables: ${result.variables.undefined.join(', ')}\n`;
      }
      if (!feedback) feedback = 'No issues detected.';
      setAiHelp(feedback);

      if (isFreeMode && !isEditingExisting && !hasPromptedSave) {
        setHasPromptedSave(true);  
        setShowSaveDialog(true);
      }
    } catch (error) {
      console.error("Run error:", error);
      setOutput(`❌ Syntax Error:\n${error.message}`);
      setAiHelp("");
    }
  };

  const handleAIFeedback = async () => {
  try {
    const result = await api.getAIFeedback(code);
    // Format the AI response into a readable string for the AI Help tab
    const helpText = `
💡 Feedback: ${result.feedback}

🔧 Suggestions:
${result.suggestions.map(s => `• ${s}`).join('\n')}

⚠️ Issues:
${result.possible_issues.map(i => `• ${i}`).join('\n')}

⏱️ Complexity: ${result.complexity_estimate}
    `;
    setAiHelp(helpText);
    // Optional: switch to AI help tab if OutputPanel supports tabs
  } catch (error) {
    console.error('AI feedback failed:', error);
    setAiHelp('AI service unavailable. Please try again later.');
  }
};

  const handleSkipSave = () => {
    setShowSaveDialog(false);
    setHasPromptedSave(false); 
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Submitting exercise:", id, "student:", user?.id);
      const result = await api.submitCode(parseInt(id), user?.id || 1, code);
      console.log("Submit result:", result);
      
      if (result.success) {
        alert('Exercise submitted successfully!');
        navigate('/student/dashboard');
      } else {
        alert('Submission failed: ' + (result.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit: ' + error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', padding: '1rem' }}>
      {/* Header for free mode */}
      {isFreeMode && (
        <div className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                {isEditingExisting ? exerciseTitle : 'Free Coding Mode'}
              </h2>
              {isEditingExisting && (
                <span style={{
                  background: '#eff6ff', color: '#3b82f6', padding: '0.125rem 0.5rem',
                  borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}>
                  <Edit2 size={12} /> Editing
                </span>
              )}
            </div>
            <p style={{ color: '#6b7280' }}>
              {isEditingExisting 
                ? 'Edit your saved exercise. Run to test changes, then update to save.'
                : 'Write and test your pseudo-code freely. Run your code to save it as an exercise.'
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isEditingExisting && (
              <button onClick={handleUpdateExercise} style={{
                background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem',
                borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500',
                display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'
              }}>
                <Save size={16} /> Update Exercise
              </button>
            )}
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {savedExercises.length} saved
            </div>
          </div>
        </div>
      )}

      {isExercise && exerciseDescription && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            📝 Description
          </h3>
          <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.5' }}>
            {exerciseDescription}
          </p>
          {starterCode && (
            <div style={{ marginTop: '0.75rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                Starter Code:
              </h4>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                overflow: 'auto'
              }}>
                {starterCode}
              </pre>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: showOutput ? '1fr 1fr' : '1fr', gap: '1rem', height: isFreeMode ? 'calc(100% - 140px)' : 'calc(100% - 100px)' }}>
        <CodeEditor 
          code={code} 
          setCode={setCode} 
          onRun={handleRunCode}
          onToggleOutput={toggleOutput}
          showOutput={showOutput}
          onAIHelp={handleAIFeedback}
        />        
        {showOutput && <OutputPanel output={output} complexity={complexity} aiHelp={aiHelp} variables={variables} />}
      </div>

      {/* Submit button - visible for class exercises */}
      {isExercise && (
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSubmit} disabled={isSubmitting}
            className="btn-primary"
            style={{ background: '#10b981', padding: '0.75rem 2rem', opacity: isSubmitting ? 0.5 : 1 }}>
            {isSubmitting ? 'Submitting...' : 'Submit Exercise'}
          </button>
        </div>
      )}

      {showSaveDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
          <div className="card" style={{ width: '400px', padding: '1.5rem' }}>
            <h2>Save Exercise</h2>
            <input
              type="text"
              value={exerciseTitle}
              onChange={(e) => setExerciseTitle(e.target.value)}
              placeholder="Exercise title"
              style={{ width: '100%', padding: '0.5rem', margin: '1rem 0' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={handleSkipSave} className="btn-secondary">Skip</button>
              <button onClick={handleSaveExercise} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingScreen;