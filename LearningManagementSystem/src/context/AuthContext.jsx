import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Checks if a JWT token is expired without a library
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const stored = localStorage.getItem('user');

      // Auto-clear expired token on app load
      if (token && isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }

      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token');
    if (stored && isTokenExpired(stored)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return stored || null;
  });

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
