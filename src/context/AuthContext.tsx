import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUserWithPermissions } from '../interface/user.interface';

interface AuthContextType {
  user: IUserWithPermissions | null;
  token: string | null;
  login: (userData: IUserWithPermissions, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUserWithPermissions | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // derived flags
  const isAuthenticated = Boolean(user && token);
  const isAdmin         = user?.role === 'admin';

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const raw = JSON.parse(storedUser) as Omit<IUserWithPermissions, 'last_login' | 'createdAt'> & {
          last_login: string | null;
          createdAt: string;
        };
        // Преобразуем строки в Date
        const parsedUser: IUserWithPermissions = {
          ...raw,
          last_login: raw.last_login ? new Date(raw.last_login) : null,
          createdAt: new Date(raw.createdAt),
        };
        setUser(parsedUser);
        setToken(storedToken);
      } catch (e) {
        console.error('AuthContext: failed to parse stored user', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: IUserWithPermissions, jwt: string) => {
    // При логине обнуляем ошибки
    setError(null);
    setUser(userData);
    setToken(jwt);
    // Сохраняем даты как ISO-строки
    localStorage.setItem('user', JSON.stringify({
      ...userData,
      last_login: userData.last_login ?? null,
      createdAt: userData.createdAt,
    }));
    localStorage.setItem('token', jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
