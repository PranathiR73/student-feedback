// context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create context
export const AuthContext = createContext();

//  roles: "student", "faculty", "admin"
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulated login from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
