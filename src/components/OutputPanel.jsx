import React, { useState } from 'react';
import { AlertCircle, TrendingUp, MessageCircle, Table } from 'lucide-react';

const OutputPanel = ({ output, complexity, aiHelp, variables, executionSteps }) => {
  const [activeTab, setActiveTab] = useState('output');

  const tabs = [
    { id: 'output', label: 'Output', icon: AlertCircle },
    { id: 'complexity', label: 'Complexity', icon: TrendingUp },
    { id: 'aihelp', label: 'AI Help', icon: MessageCircle },
    { id: 'variables', label: 'Variables', icon: Table },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e5e7eb',
        background: '#f9fafb',
        borderRadius: '0.5rem 0.5rem 0 0',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: activeTab === tab.id ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : 'none',
              color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '1rem', overflow: 'auto', flex: 1 }}>
        {activeTab === 'output' && (
          <div>
            <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Execution Output:</h4>
            <pre style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '0.375rem',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}>
              {output || 'No output yet. Click Run to execute your code.'}
            </pre>
            
            {variables && variables.length > 0 && (
              <>
                <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: '#374151' }}>Variables (step by step):</h4>
                <VariableTable variables={variables} executionSteps={executionSteps} />
              </>
            )}
          </div>
        )}

        {activeTab === 'complexity' && (
          <div>
            <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Time Complexity Analysis:</h4>
            <div style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
            }}>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#7c3aed',
              }}>
                {complexity || 'Not calculated yet'}
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {complexity && getComplexityExplanation(complexity)}
            </p>
          </div>
        )}

        {activeTab === 'aihelp' && (
          <div>
            <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>AI Assistant:</h4>
            <div style={{
              background: '#eff6ff',
              padding: '1rem',
              borderRadius: '0.375rem',
              borderLeft: '4px solid #3b82f6',
            }}>
              <p style={{ color: '#1e40af' }}>{aiHelp || 'Run your code to get AI-powered feedback and suggestions.'}</p>
            </div>
          </div>
        )}

        {activeTab === 'variables' && (
          <div>
            <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Variable State:</h4>
            {variables && variables.length > 0 ? (
              <VariableTable variables={variables} executionSteps={executionSteps} />
            ) : (
              <p style={{ color: '#6b7280' }}>No variables tracked yet. Run your code to see variable states.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const VariableTable = ({ variables, executionSteps }) => {
  if (!variables || variables.length === 0) return null;
  
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.875rem',
      }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>Step</th>
            {Object.keys(variables[0]).filter(key => key !== 'step').map(key => (
              <th key={key} style={{ textAlign: 'left', padding: '0.5rem', background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variables.map((variable, idx) => (
            <tr key={idx}>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', fontFamily: 'monospace' }}>{variable.step || idx + 1}</td>
              {Object.entries(variable).filter(([key]) => key !== 'step').map(([key, value]) => (
                <td key={key} style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', fontFamily: 'monospace' }}>{String(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function getComplexityExplanation(complexity) {
  const explanations = {
    'O(1)': 'Constant time - Excellent! Your algorithm runs in the same time regardless of input size.',
    'O(log n)': 'Logarithmic time - Very efficient! Time grows slowly as input increases.',
    'O(n)': 'Linear time - Good! Time grows proportionally to input size.',
    'O(n log n)': 'Linearithmic time - Decent efficiency, common in sorting algorithms.',
    'O(n²)': 'Quadratic time - Consider optimizing for large inputs.',
    'O(2^n)': 'Exponential time - May be too slow for large inputs. Try to optimize.',
  };
  return explanations[complexity] || 'Analyze your algorithm for potential optimizations.';
}

export default OutputPanel;