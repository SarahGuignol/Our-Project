import React, { useState, useRef } from 'react';
import { Play, Trash2, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

const CodeEditor = ({ code, setCode, onRun, onToggleOutput, showOutput, onToggleFullscreen, isFullscreen }) => {
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    const lines = newCode.split('\n').length;
    setLineCount(lines);
  };

  const handleClear = () => {
    setCode('');
  };

  // Synchroniser le défilement des numéros avec le textarea
  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#1e1e1e',
      borderRadius: '0.5rem',
      overflow: 'hidden',
    }}>
      {/* Barre d'outils */}
      <div style={{
        background: '#2d2d2d',
        padding: '0.5rem',
        borderBottom: '1px solid #3e3e3e',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span style={{ color: '#ccc', fontSize: '0.75rem', fontWeight: '500' }}>
          Pseudo-code Editor
        </span>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              style={{
                background: '#4b5563',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
              }}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{isFullscreen ? 'Exit' : 'Full'}</span>
            </button>
          )}
          
          {onToggleOutput && (
            <button
              onClick={onToggleOutput}
              style={{
                background: '#4b5563',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
              }}
            >
              {showOutput ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{showOutput ? 'Hide' : 'Show'}</span>
            </button>
          )}
          
          <button
            onClick={handleClear}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
            }}
          >
            <Trash2 size={14} /> Clear
          </button>
          
          <button
            onClick={onRun}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            <Play size={14} /> Run
          </button>
        </div>
      </div>
      
      {/* ZONE D'ÉDITION AVEC DÉFILEMENT SYNCHRONISÉ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Numéros de ligne - avec scroll */}
        <div
          ref={lineNumbersRef}
          style={{
            background: '#252526',
            padding: '1rem 0.5rem',
            textAlign: 'right',
            color: '#858585',
            fontFamily: 'monospace',
            fontSize: '14px',
            userSelect: 'none',
            borderRight: '1px solid #3e3e3e',
            overflowY: 'auto',  // ← Permet le défilement
            overflowX: 'hidden',
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} style={{ lineHeight: '1.5' }}>{i + 1}</div>
          ))}
        </div>
        
        {/* Éditeur de texte */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleCodeChange}
          onScroll={handleScroll}  // ← Synchronise le défilement
          style={{
            flex: 1,
            background: '#1e1e1e',
            color: '#d4d4d4',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            padding: '1rem',
            border: 'none',
            outline: 'none',
            resize: 'none',
            overflowY: 'auto',  // ← Permet le défilement
          }}
          placeholder='Write your pseudo-code here...
          
Example:
function findMax(numbers):
    max = numbers[0]
    for each num in numbers:
        if num > max:
            max = num
    return max'
        />
      </div>
    </div>
  );
};

export default CodeEditor;