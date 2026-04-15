import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password, role) => {
    // Récupérer l'utilisateur depuis localStorage s'il existe
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      // Si l'utilisateur existe déjà (Sign Up), l'utiliser
      const user = JSON.parse(savedUser);
      setUser(user);
      return user;
    }
    
    // Sinon, créer un nouvel utilisateur (Login par défaut)
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
 
  const signup = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
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
  <AuthContext.Provider value={{ user, login, logout, updateProfile, signup }}>
    {children}
  </AuthContext.Provider>
);
};