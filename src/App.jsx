import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/student/StudentDashboard';
import CodingScreen from './pages/student/CodingScreen';
import StudentHistory from './pages/student/StudentHistory';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ExerciseManager from './pages/teacher/ExerciseManager';
import SubmissionsReview from './pages/teacher/SubmissionsReview';
import Analytics from './pages/teacher/Analytics';
import PushCode from './pages/teacher/PushCode';

// Pages Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlatformSettings from './pages/admin/PlatformSettings';
import SystemAnalytics from './pages/admin/SystemAnalytics';
import ContentModeration from './pages/admin/ContentModeration';

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
          <Route path="/teacher/analytics" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Analytics />
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
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PlatformSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SystemAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/moderation" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ContentModeration />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;