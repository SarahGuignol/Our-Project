import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Mock users database for admin
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('allUsers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'a1', name: 'Admin User', email: 'admin@codelearn.com', role: 'admin', status: 'active', joinDate: '2024-01-01', bio: 'Platform administrator' },
      { id: 't1', name: 'Dr. Smith', email: 'teacher@school.edu', role: 'teacher', status: 'active', joinDate: '2024-01-10', bio: 'Computer science educator' },
      { id: 's1', name: 'John Doe', email: 'student@university.edu', role: 'student', status: 'active', joinDate: '2024-01-15', bio: 'CS student' },
    ];
  });

  const saveAllUsers = (users) => {
    setAllUsers(users);
    localStorage.setItem('allUsers', JSON.stringify(users));
  };

  const login = (email, password, role) => {
    const existingUser = allUsers.find(u => u.email === email && u.role === role);
    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem('user', JSON.stringify(existingUser));
      return existingUser;
    }
    const newUser = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      bio: role === 'teacher' ? 'Experienced computer science educator passionate about teaching algorithms.' : role === 'admin' ? 'Platform administrator' : 'Computer Science student passionate about algorithms and problem solving.',
      photo: null
    };
    setUser(newUser);
    saveAllUsers([...allUsers, newUser]);
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  };

  const signup = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    saveAllUsers([...allUsers, newUser]);
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    const updatedAll = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveAllUsers(updatedAll);
    return updatedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Admin functions
  const createUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    saveAllUsers([...allUsers, newUser]);
    return newUser;
  };

  const deleteUser = (userId) => {
    const updated = allUsers.filter(u => u.id !== userId);
    saveAllUsers(updated);
    if (user && user.id === userId) {
      logout();
    }
  };

  const resetUserPassword = (userId) => {
    alert(`Password reset link sent for user ${userId}`);
  };

  const updateGlobalSettings = (settings) => {
    localStorage.setItem('platformSettings', JSON.stringify(settings));
  };

  const getGlobalSettings = () => {
    const saved = localStorage.getItem('platformSettings');
    return saved ? JSON.parse(saved) : {
      siteName: 'Algorithm Analyser & Debugger',
      maintenanceMode: false,
      allowSignups: true,
      aiApiKey: '',
      contactEmail: 'admin@codelearn.com'
    };
  };

  const value = {
    user,
    allUsers: user?.role === 'admin' ? allUsers : null,
    login,
    logout,
    updateProfile,
    signup,
    createUser,
    deleteUser,
    resetUserPassword,
    updateGlobalSettings,
    getGlobalSettings
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};