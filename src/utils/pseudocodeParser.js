// Simple pseudocode interpreter (for demonstration)
export const executePseudocode = (code, input = null) => {
  const variables = [];
  let output = '';
  let step = 0;
  
  // Track variable changes
  const trackVariables = (vars) => {
    variables.push({ ...vars, step: step++ });
  };
  
  // Simple simulation
  const lines = code.split('\n');
  let currentVars = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Assignment
    if (line.includes('=')) {
      const [varName, value] = line.split('=').map(s => s.trim());
      currentVars[varName] = isNaN(value) ? value : Number(value);
      trackVariables(currentVars);
    }
    // Print statement
    else if (line.startsWith('print')) {
      const toPrint = line.replace('print', '').trim().replace(/[()]/g, '');
      if (currentVars[toPrint]) {
        output += String(currentVars[toPrint]) + '\n';
      } else {
        output += toPrint + '\n';
      }
    }
  }
  
  return { output, variables, success: true };
};

export const analyzeComplexity = (code) => {
  const codeLower = code.toLowerCase();
  
  // Simple complexity detection
  if (codeLower.includes('for') && codeLower.split('for').length > 3) {
    return 'O(n²)';
  } else if (codeLower.includes('for') || codeLower.includes('while')) {
    return 'O(n)';
  } else if (codeLower.includes('if') && (codeLower.includes('for') || codeLower.includes('while'))) {
    return 'O(n)';
  } else {
    return 'O(1)';
  }
};

export const getAIHelp = (code, output, variables) => {
  const help = [];
  
  // Check for common issues
  if (code.toLowerCase().includes('for') && !code.includes('end for')) {
    help.push('💡 Make sure your for loops have proper indentation and closing statements.');
  }
  
  if (variables && variables.length === 0 && code.length > 0) {
    help.push('💡 Your code doesn\'t seem to modify any variables. Consider using variables to store data.');
  }
  
  if (output && output.includes('undefined')) {
    help.push('⚠️ You\'re trying to use an undefined variable. Check if all variables are initialized.');
  }
  
  if (help.length === 0 && code.length > 0) {
    help.push('✓ Your code structure looks good! Consider adding comments to explain your logic.');
    help.push('📚 Try to break down complex operations into smaller, reusable functions.');
  }
  
  return help.join('\n\n');
};