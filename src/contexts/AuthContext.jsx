import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    if (data.success) {
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        bio: data.user.bio || '',
        photo: data.user.photo || null,
        joinDate: data.user.join_date || data.user.created_at 
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }

    throw new Error('Login failed');
  };

  const signup = async (userData) => {
    const response = await fetch('http://localhost:8000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        bio: userData.bio || ''
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Signup failed');
    }

    if (data.success) {
      const newUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        bio: data.user.bio || '',
        photo: null,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    }

    throw new Error('Signup failed');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedData.name,
          email: updatedData.email,
          password: updatedData.password || '',
          role: user.role,
          bio: updatedData.bio || ''
        })
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = { 
          ...user, 
          name: data.user.name,
          email: data.user.email,
          bio: data.user.bio,
          photo: updatedData.photo || user?.photo
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new Error(data.detail || 'Update failed');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const updateUserPhoto = async (photoBase64) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}/photo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: photoBase64 })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, photo: photoBase64 };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update photo:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    signup,
    updateUserPhoto,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};