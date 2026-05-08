// src/services/api.js
const API_URL = 'http://localhost:8000';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const api = {
  // Analyse
  async analyzeCode(code) {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return handleResponse(response);
  },

  // Users
  async getUsers() {
    const response = await fetch(`${API_URL}/api/users`);
    return handleResponse(response);
  },

  async getUser(userId) {
    const response = await fetch(`${API_URL}/api/users/${userId}`);
    if (!response.ok && response.status === 404) return null;
    return handleResponse(response);
  },

  // Classes
  async getClasses() {
    const response = await fetch(`${API_URL}/api/classes`);
    return handleResponse(response);
  },

  async getTeacherClasses(teacherId) {
    const response = await fetch(`${API_URL}/api/classes/teacher/${teacherId}`);
    return handleResponse(response);
  },

  async createClass(data) {
    const response = await fetch(`${API_URL}/api/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async updateClass(classId, data) {
    const response = await fetch(`${API_URL}/api/classes/${classId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async deleteClass(classId) {
    const response = await fetch(`${API_URL}/api/classes/${classId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  // Enrollments
  async enrollStudent(classId, studentId) {
    const response = await fetch(`${API_URL}/api/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: classId, student_id: studentId })
    });
    return handleResponse(response);
  },

  async getStudentEnrollments(studentId) {
    try {
      const response = await fetch(`${API_URL}/api/enrollments/student/${studentId}`);
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }
  },

  async getEnrollmentsByClass(classId) {
    try {
      const response = await fetch(`${API_URL}/api/enrollments/class/${classId}`);
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }
  },

  // Exercises
  async getClassExercises(classId) {
    try {
      const response = await fetch(`${API_URL}/api/exercises/class/${classId}`);
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }
  },

  async getExercise(exerciseId) {
    console.log("API call: getExercise", exerciseId);
    const response = await fetch(`${API_URL}/api/exercises/${exerciseId}`);
    if (!response.ok && response.status === 404) return null;
    const data = await response.json();
    console.log("API response:", data);
    return data;
  },

  async createExercise(data) {
    const response = await fetch(`${API_URL}/api/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async updateExercise(exerciseId, data) {
    const response = await fetch(`${API_URL}/api/exercises/${exerciseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async deleteExercise(exerciseId) {
    const response = await fetch(`${API_URL}/api/exercises/${exerciseId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  // Submissions
  async submitCode(exerciseId, studentId, code) {
    const response = await fetch(`${API_URL}/api/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercise_id: exerciseId, student_id: studentId, code })
    });
    return handleResponse(response);
  },

  async getExerciseSubmissions(exerciseId) {
    try {
      const response = await fetch(`${API_URL}/api/submissions/exercise/${exerciseId}`);
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }
  },

  async getStudentSubmissions(studentId) {
    try {
      const response = await fetch(`${API_URL}/api/submissions/student/${studentId}`);
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }
  },

  async gradeSubmission(submissionId, grade, comment) {
    const response = await fetch(`${API_URL}/api/submissions/${submissionId}/grade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, teacher_comment: comment })
    });
    return handleResponse(response);
  },

  // Free Exercises
  async saveFreeExercise(studentId, title, code) {
    const response = await fetch(`${API_URL}/api/free-exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, title, code })
    });
    return handleResponse(response);
  },

  async getFreeExercises(studentId) {
    try {
      const response = await fetch(`${API_URL}/api/free-exercises/student/${studentId}`);
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }
  },

  async updateFreeExercise(exerciseId, data) {
    const response = await fetch(`${API_URL}/api/free-exercises/${exerciseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async deleteFreeExercise(exerciseId) {
    const response = await fetch(`${API_URL}/api/free-exercises/${exerciseId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  // AI Feedback
  async getAIFeedback(code, context = null) {
    const response = await fetch(`${API_URL}/api/ai/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, context })
    });
    return handleResponse(response);
  },

  async getAdminDashboard() {
    const response = await fetch(`${API_URL}/api/admin/dashboard`);
    return handleResponse(response);
  },

  async deleteUser(userId) {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  async resetUserPassword(userId, newPassword) {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword })
    });
    return handleResponse(response);
  },

  // Health
  async health() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return response.json();
    } catch {
      return { status: 'unreachable' };
    }
  }
};

export default api;