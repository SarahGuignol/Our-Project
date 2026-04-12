import React, { useState } from 'react';
import { Play, Trash2 } from 'lucide-react';

const CodeEditor = ({ code, setCode, onRun, language = 'pseudocode' }) => {
  const [lineCount, setLineCount] = useState(1);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    const lines = newCode.split('\n').length;
    setLineCount(lines);
  };

  const handleClear = () => {
    setCode('');
  };

  // Syntax highlighting for pseudocode
  const highlightSyntax = (code) => {
    const keywords = ['if', 'else', 'while', 'for', 'function', 'return', 'print', 'input'];
    let highlighted = code;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span style="color: #569cd6; font-weight: bold;">${keyword}</span>`);
    });
    return highlighted;
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
      <div style={{
        background: '#2d2d2d',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid #3e3e3e',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: '#ccc', fontSize: '0.875rem' }}>Pseudo-code Editor</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleClear}
            style={{
              background: '#4b5563',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            <Trash2 size={16} /> Clear
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
              gap: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            <Play size={16} /> Run
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
        {/* Line numbers */}
        <div style={{
          background: '#252526',
          padding: '1rem 0.5rem',
          textAlign: 'right',
          color: '#858585',
          fontFamily: 'monospace',
          fontSize: '14px',
          userSelect: 'none',
          borderRight: '1px solid #3e3e3e',
        }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} style={{ lineHeight: '1.5' }}>{i + 1}</div>
          ))}
        </div>
        
        {/* Code editor */}
        <textarea
          value={code}
          onChange={handleCodeChange}
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