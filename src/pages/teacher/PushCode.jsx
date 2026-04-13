import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../../components/CodeEditor';
import OutputPanel from '../../components/OutputPanel';
import { executePseudocode, analyzeComplexity, getAIHelp } from '../../utils/pseudocodeParser';

const PushCode = () => {
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

  const handleRunCode = () => {
    const result = executePseudocode(code);
    setOutput(result.output);
    setVariables(result.variables || []);
    
    const complexityResult = analyzeComplexity(code);
    setComplexity(complexityResult);
    
    const aiHelpResult = getAIHelp(code, result.output, result.variables);
    setAiHelp(aiHelpResult);
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
      {/* Header avec titre */}
      {isExercise && exercise && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{exercise.title}</h2>
          <p style={{ color: '#6b7280' }}>{exercise.description}</p>
        </div>
      )}

      {/* Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showOutput ? '1fr 1fr' : '1fr',
        gap: '1rem',
        height: 'calc(100% - 100px)',
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

      {/* Submit button */}
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
    </div>
  );
};

export default PushCode;