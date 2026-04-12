import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password, role) => {
    const user = {
      id: role === 'teacher' ? 't1' : 's1',
      name: role === 'teacher' ? 'Dr. Smith' : 'John Doe',
      email: email,
      role: role,
      bio: role === 'teacher' 
        ? 'Experienced computer science educator passionate about teaching algorithms.'
        : 'Computer Science student passionate about algorithms and problem solving.',
      photo: null,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};