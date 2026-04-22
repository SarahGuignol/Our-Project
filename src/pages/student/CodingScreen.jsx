import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../../components/CodeEditor';
import OutputPanel from '../../components/OutputPanel';
import { executePseudocode, analyzeComplexity, getAIHelp } from '../../utils/pseudocodeParser';
import { Save, X, Edit2 } from 'lucide-react';

const CodingScreen = () => {
  const { mode, id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [complexity, setComplexity] = useState('');
  const [aiHelp, setAiHelp] = useState('');
  const [variables, setVariables] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [hasRunOnce, setHasRunOnce] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [currentExerciseId, setCurrentExerciseId] = useState(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [savedExercises, setSavedExercises] = useState(() => {
    const saved = localStorage.getItem('freeExercises');
    return saved ? JSON.parse(saved) : [];
  });
  
  const isExercise = mode === 'exercise';
  
  const [exercise] = useState(isExercise ? {
    id: id,
    title: 'Find Maximum Number',
    description: 'Write a function that finds the maximum number in an array.',
    starterCode: 'function findMax(numbers):\n    # Write your code here\n    return max'
  } : null);

  useEffect(() => {
    if (isExercise && exercise?.starterCode) {
      setCode(exercise.starterCode);
    }
  }, [isExercise, exercise]);

  useEffect(() => {
    if (mode === 'free' && id) {
      const saved = localStorage.getItem('freeExercises');
      if (saved) {
        const exercises = JSON.parse(saved);
        const loadedExercise = exercises.find(ex => ex.id === parseInt(id) || ex.id === id);
        if (loadedExercise) {
          setCode(loadedExercise.code);
          setCurrentExerciseId(loadedExercise.id);
          setExerciseTitle(loadedExercise.title);
          setIsEditingExisting(true);
          setHasRunOnce(true);
        }
      }
    } else if (mode === 'free' && !id) {
      const savedCode = localStorage.getItem('freeModeCode');
      if (savedCode) {
        setCode(savedCode);
      }
      setIsEditingExisting(false);
      setCurrentExerciseId(null);
      setExerciseTitle('');
      setHasRunOnce(false);
    }
  }, [mode, id]);

  useEffect(() => {
    if (mode === 'free' && !id && code) {
      localStorage.setItem('freeModeCode', code);
    }
  }, [code, mode, id]);

  const handleRunCode = () => {
    const result = executePseudocode(code);
    setOutput(result.output);
    setVariables(result.variables || []);
    
    const complexityResult = analyzeComplexity(code);
    setComplexity(complexityResult);
    
    const aiHelpResult = getAIHelp(code, result.output, result.variables);
    setAiHelp(aiHelpResult);

    if (mode === 'free' && !id && !hasRunOnce && !isEditingExisting) {
      setHasRunOnce(true);
      setShowSaveDialog(true);
    }
    
    if (currentExerciseId) {
      updateExistingExercise({ lastRun: new Date().toISOString() });
    }
  };

  const handleSaveExercise = () => {
    if (!exerciseTitle.trim()) {
      alert('Please enter a title for your exercise');
      return;
    }

    const newExercise = {
      id: Date.now(),
      title: exerciseTitle,
      code: code,
      createdAt: new Date().toISOString(),
      lastRun: new Date().toISOString(),
      output: output,
      complexity: complexity
    };

    const updatedExercises = [...savedExercises, newExercise];
    setSavedExercises(updatedExercises);
    localStorage.setItem('freeExercises', JSON.stringify(updatedExercises));
    
    setCurrentExerciseId(newExercise.id);
    setIsEditingExisting(true);
    setShowSaveDialog(false);
    
    navigate(`/student/coding/free/${newExercise.id}`, { replace: true });
    
    alert(`Exercise "${exerciseTitle}" saved successfully!`);
  };

  const handleUpdateExercise = () => {
    const updatedExercises = savedExercises.map(ex => 
      ex.id === currentExerciseId 
        ? { 
            ...ex, 
            code: code, 
            lastRun: new Date().toISOString(),
            output: output,
            complexity: complexity
          }
        : ex
    );
    
    setSavedExercises(updatedExercises);
    localStorage.setItem('freeExercises', JSON.stringify(updatedExercises));
    
    alert(`Exercise "${exerciseTitle}" updated successfully!`);
  };

  const updateExistingExercise = (updates) => {
    const updatedExercises = savedExercises.map(ex => 
      ex.id === currentExerciseId 
        ? { ...ex, ...updates }
        : ex
    );
    setSavedExercises(updatedExercises);
    localStorage.setItem('freeExercises', JSON.stringify(updatedExercises));
  };

  const handleSkipSave = () => {
    setShowSaveDialog(false);
    setExerciseTitle('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Exercise submitted successfully!');
      setIsSubmitting(false);
      navigate('/student/dashboard');
    }, 1500);
  };

  const toggleOutput = () => {
    setShowOutput(!showOutput);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div style={{ 
      height: 'calc(100vh - 64px)', 
      padding: '1rem',
      position: isFullscreen ? 'fixed' : 'relative',
      top: isFullscreen ? 0 : 'auto',
      left: isFullscreen ? 0 : 'auto',
      right: isFullscreen ? 0 : 'auto',
      bottom: isFullscreen ? 0 : 'auto',
      zIndex: isFullscreen ? 1000 : 'auto',
      background: isFullscreen ? '#f5f7fa' : 'transparent'
    }}>
      {isExercise && exercise && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{exercise.title}</h2>
          <p style={{ color: '#6b7280' }}>{exercise.description}</p>
        </div>
      )}

      {mode === 'free' && (
        <div className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                {isEditingExisting ? exerciseTitle : 'Free Coding Mode'}
              </h2>
              {isEditingExisting && (
                <span style={{
                  background: '#eff6ff',
                  color: '#3b82f6',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
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
              <button
                onClick={handleUpdateExercise}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem'
                }}
              >
                <Save size={16} /> Update Exercise
              </button>
            )}
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {savedExercises.length} saved
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: showOutput ? '1fr 1fr' : '1fr',
        gap: '1rem',
        height: mode === 'free' && isEditingExisting ? 'calc(100% - 140px)' : 'calc(100% - 100px)',
        transition: 'all 0.3s ease'
      }}>
        <CodeEditor 
          code={code} 
          setCode={setCode} 
          onRun={handleRunCode}
          onToggleOutput={toggleOutput}
          showOutput={showOutput}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
        />
        
        {showOutput && (
          <OutputPanel
            output={output}
            complexity={complexity}
            aiHelp={aiHelp}
            variables={variables}
          />
        )}
      </div>

      {isExercise && (
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              background: '#10b981',
              padding: '0.75rem 2rem',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exercise'}
          </button>
        </div>
      )}

      {showSaveDialog && !isEditingExisting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
        }}>
          <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={20} color="#3b82f6" />
                Save Your Exercise
              </h2>
              <button 
                onClick={handleSkipSave}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} color="#9ca3af" />
              </button>
            </div>
            
            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
              Great work! Would you like to save this exercise? Give it a title to easily find it later.
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Exercise Title
              </label>
              <input
                type="text"
                value={exerciseTitle}
                onChange={(e) => setExerciseTitle(e.target.value)}
                placeholder="e.g., My Bubble Sort Algorithm"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveExercise();
                  }
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSkipSave}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Skip for Now
              </button>
              <button
                onClick={handleSaveExercise}
                className="btn-primary"
                style={{ 
                  padding: '0.5rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Save size={16} /> Save Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingScreen;