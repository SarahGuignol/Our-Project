// Mock data shared across all components
export const allPlatformClasses = [
  {
    id: 1,
    name: 'CS101 - Programming Fundamentals',
    teacher: 'Dr. Smith',
    teacherId: 't1',
    students: 25,
    description: 'Introduction to programming concepts and problem-solving techniques.',
    exercises: [
      { id: 1, title: 'Find Maximum Number', dueDate: '2024-01-20', status: 'completed', grade: 85 },
      { id: 2, title: 'Calculate Factorial', dueDate: '2024-01-25', status: 'pending', grade: null },
    ]
  },
  {
    id: 2,
    name: 'CS201 - Data Structures',
    teacher: 'Dr. Smith',
    teacherId: 't1',
    students: 20,
    description: 'Advanced data structures including linked lists, trees, and graphs.',
    exercises: [
      { id: 3, title: 'Bubble Sort Algorithm', dueDate: '2024-01-30', status: 'pending', grade: null },
      { id: 4, title: 'Binary Search Implementation', dueDate: '2024-02-05', status: 'not_started', grade: null },
      { id: 5, title: 'Linked List Operations', dueDate: '2024-02-10', status: 'not_started', grade: null },
    ]
  },
  {
    id: 3,
    name: 'CS301 - Algorithms',
    teacher: 'Dr. Johnson',
    teacherId: 't2',
    students: 18,
    description: 'Algorithm design, analysis, and optimization techniques.',
    exercises: [
      { id: 6, title: 'Quick Sort Implementation', dueDate: '2024-02-15', status: 'not_started', grade: null },
      { id: 7, title: 'Dijkstra Algorithm', dueDate: '2024-02-20', status: 'not_started', grade: null },
    ]
  },
  {
    id: 4,
    name: 'MATH101 - Discrete Mathematics',
    teacher: 'Prof. Williams',
    teacherId: 't3',
    students: 30,
    description: 'Mathematical foundations for computer science.',
    exercises: [
      { id: 8, title: 'Set Theory Problems', dueDate: '2024-02-12', status: 'not_started', grade: null },
      { id: 9, title: 'Graph Theory Basics', dueDate: '2024-02-18', status: 'not_started', grade: null },
    ]
  },
  {
    id: 5,
    name: 'CS401 - Machine Learning',
    teacher: 'Dr. Brown',
    teacherId: 't4',
    students: 15,
    description: 'Introduction to machine learning algorithms and applications.',
    exercises: [
      { id: 10, title: 'Linear Regression', dueDate: '2024-02-22', status: 'not_started', grade: null },
      { id: 11, title: 'K-Means Clustering', dueDate: '2024-02-28', status: 'not_started', grade: null },
    ]
  },
  {
    id: 6,
    name: 'CS202 - Database Systems',
    teacher: 'Dr. Davis',
    teacherId: 't5',
    students: 22,
    description: 'Database design, SQL, and data management.',
    exercises: [
      { id: 12, title: 'SQL Queries', dueDate: '2024-02-14', status: 'not_started', grade: null },
      { id: 13, title: 'Database Normalization', dueDate: '2024-02-21', status: 'not_started', grade: null },
    ]
  }
];

// Initialize localStorage with mock data if not exists
export const initializeMockData = () => {
  if (!localStorage.getItem('allPlatformClasses')) {
    localStorage.setItem('allPlatformClasses', JSON.stringify(allPlatformClasses));
  }
  if (!localStorage.getItem('enrolledClasses')) {
    localStorage.setItem('enrolledClasses', JSON.stringify([1, 2]));
  }
};

// Helper function to get enrolled classes
export const getEnrolledClasses = () => {
  const enrolledClassIds = JSON.parse(localStorage.getItem('enrolledClasses') || '[1, 2]');
  const classes = JSON.parse(localStorage.getItem('allPlatformClasses')) || allPlatformClasses;
  return classes.filter(cls => enrolledClassIds.includes(cls.id));
};

// Helper function to calculate student stats
export const calculateStudentStats = (user) => {
  const enrolledClasses = getEnrolledClasses();
  const allExercises = enrolledClasses.flatMap(cls => cls.exercises || []);
  
  const completedExercises = allExercises.filter(e => e.status === 'completed');
  const gradedExercises = allExercises.filter(e => e.grade !== null);
  
  const averageGrade = gradedExercises.length > 0
    ? Math.round(gradedExercises.reduce((sum, e) => sum + e.grade, 0) / gradedExercises.length)
    : 0;

  const estimatedHours = Math.max(12, Math.round(completedExercises.length * 2.5));

  return {
    totalExercises: allExercises.length,
    completedExercises: completedExercises.length,
    averageGrade: averageGrade,
    totalHours: estimatedHours,
    enrolledClasses: enrolledClasses.length,
    joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
    location: 'San Francisco, CA'
  };
};