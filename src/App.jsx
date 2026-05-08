import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CodingScreen from './pages/student/CodingScreen';
import StudentHistory from './pages/student/StudentHistory';
import BrowseClasses from './pages/student/BrowseClasses';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ClassesManagement from './pages/teacher/ClassesManagement';
import TClassExercises from './pages/teacher/TClassExercises';
import ExerciseManager from './pages/teacher/ExerciseManager';
import SubmissionsReview from './pages/teacher/SubmissionsReview';
import PushCode from './pages/teacher/PushCode';
import Analytics from './pages/teacher/Analytics';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlatformSettings from './pages/admin/PlatformSettings';
import SystemAnalytics from './pages/admin/SystemAnalytics';
import ClassManagement from './pages/admin/ClassManagement';
import ClassExercises from './pages/admin/ClassExercises';
import ExerciseDetail from './pages/admin/ExerciseDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/browse" element={
            <ProtectedRoute allowedRoles={['student']}>
              <BrowseClasses />
            </ProtectedRoute>
          } />
          <Route path="/student/coding/:mode/:id?" element={
            <ProtectedRoute allowedRoles={['student']}>
              <CodingScreen />
            </ProtectedRoute>
          } />
          <Route path="/student/history" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentHistory />
            </ProtectedRoute>
          } />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/teacher/classes" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <ClassesManagement />
            </ProtectedRoute>
          } />
          <Route path="/teacher/classes/:classId/exercises" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TClassExercises />
            </ProtectedRoute>
          } />
          <Route path="/teacher/exercises" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <ExerciseManager />
            </ProtectedRoute>
          } />
          <Route path="/teacher/submissions/:exerciseId" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <SubmissionsReview />
            </ProtectedRoute>
          } />
          <Route path="/teacher/submissions" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <SubmissionsReview />
            </ProtectedRoute>
          } />
          <Route path="/teacher/push-code" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <PushCode />
            </ProtectedRoute>
          } />
          <Route path="/teacher/push-code/:exerciseId/:studentId" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <PushCode />
            </ProtectedRoute>
          } />
          <Route path="/teacher/analytics" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Analytics />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/classes" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ClassManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/classes/:classId/exercises" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ClassExercises />
            </ProtectedRoute>
          } />
          <Route path="/admin/classes/:classId/exercises/:exerciseId" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ExerciseDetail />
            </ProtectedRoute>
          } />
          <Route path="/admin/classes/:classId/exercises/:exerciseId" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ExerciseDetail />
            </ProtectedRoute>
          } />
          <Route path="/admin/classes/:classId/exercises/new" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ExerciseManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/classes/:classId/exercises/:exerciseId/edit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TClassExercises />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SystemAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PlatformSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;