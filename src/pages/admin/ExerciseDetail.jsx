import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Code } from 'lucide-react';

const ExerciseDetail = () => {
  const { classId, exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [className, setClassName] = useState('');

  useEffect(() => {
    // Mock data - in real app, fetch from API/localStorage
    // This simulates getting exercise details
    const mockExercises = {
      1: {
        id: 1,
        title: 'Find Maximum Number',
        description: 'Write a function that finds the maximum number in an array of integers. The function should iterate through the array and return the largest value found.',
        dueDate: '2024-02-15',
        starterCode: `function findMax(numbers):
    # Write your code here
    # Initialize max with first element
    # Loop through array
    # Update max if larger number found
    
    return max`,
        solution: `function findMax(numbers):
    max = numbers[0]
    for each num in numbers:
        if num > max:
            max = num
    return max`,
        totalSubmissions: 20,
        avgGrade: 78
      },
      2: {
        id: 2,
        title: 'Calculate Factorial',
        description: 'Write a function that calculates the factorial of a given number n. Factorial of n (written as n!) is the product of all positive integers less than or equal to n.',
        dueDate: '2024-02-20',
        starterCode: `function factorial(n):
    # Write your code here
    # Handle base case: n = 0 or n = 1
    # Return n * factorial(n-1)
    
    return result`,
        solution: `function factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)`,
        totalSubmissions: 18,
        avgGrade: 82
      },
      3: {
        id: 3,
        title: 'Bubble Sort',
        description: 'Implement the bubble sort algorithm to sort an array of numbers in ascending order. Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        dueDate: '2024-02-25',
        starterCode: `function bubbleSort(arr):
    # Write your code here
    # Loop through array
    # Compare adjacent elements
    # Swap if needed
    
    return arr`,
        solution: `function bubbleSort(arr):
    n = length(arr)
    for i from 0 to n-1:
        for j from 0 to n-i-2:
            if arr[j] > arr[j+1]:
                swap(arr[j], arr[j+1])
    return arr`,
        totalSubmissions: 15,
        avgGrade: 75
      }
    };

    const ex = mockExercises[exerciseId];
    if (ex) {
      setExercise(ex);
    }

    // Get class name
    const savedClasses = localStorage.getItem('allClasses');
    if (savedClasses) {
      const classes = JSON.parse(savedClasses);
      const found = classes.find(c => c.id === parseInt(classId) || c.id === classId);
      if (found) {
        setClassName(found.name);
      }
    }
  }, [classId, exerciseId]);

  if (!exercise) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(`/admin/classes/${classId}/exercises`)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6b7280'
          }}
        >
          <ArrowLeft size={20} /> Back to Exercises
        </button>
      </div>

      {/* Exercise Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          {className}
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {exercise.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
            <Calendar size={18} />
            <span>Due: {exercise.dueDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
            <FileText size={18} />
            <span>{exercise.totalSubmissions} submissions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
            <span>📊 Avg Grade: {exercise.avgGrade}%</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Description</h2>
        <p style={{ color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {exercise.description}
        </p>
      </div>

      {/* Starter Code */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={20} /> Starter Code
        </h2>
        <pre style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '1rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}>
          {exercise.starterCode}
        </pre>
      </div>

      {/* Solution (visible only to admin/teacher) */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={20} /> Expected Solution
        </h2>
        <pre style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '1rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}>
          {exercise.solution}
        </pre>
      </div>
    </div>
  );
};

export default ExerciseDetail;