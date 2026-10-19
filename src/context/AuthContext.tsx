import React, { createContext, useContext, useState, useEffect } from 'react';

import { api } from '../services/api';

export type UserRole = 'STUDENT' | 'FACULTY';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  codeOrRoll: string;
  programOrDesignation: string;
  semester?: number;
  section?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  login: (selectedRole: UserRole, identifier: string, password?: string) => Promise<boolean> | boolean;
  logout: () => void;
}

export const STUDENT_PROFILE: AuthUser = {
  id: 1,
  name: "Aarav Sharma",
  email: "aarav.sharma@college.edu",
  role: "STUDENT",
  department: "Computer Science & Engineering",
  codeOrRoll: "CS2023001",
  programOrDesignation: "B.Tech Computer Science",
  semester: 3,
  section: "Section A"
};

export const FACULTY_PROFILE: AuthUser = {
  id: 1,
  name: "Dr. Arvind Sharma",
  email: "arvind.sharma@college.edu",
  role: "FACULTY",
  department: "Computer Science & Engineering",
  codeOrRoll: "FAC-CSE-001",
  programOrDesignation: "Professor & HOD"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('college_erp_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Start at login page if not authenticated
    return null;
  });

  const role = user ? user.role : null;

  const login = async (selectedRole: UserRole, identifier: string, password?: string): Promise<boolean> => {
    try {
      const res = await api.login(
        identifier,
        password || (selectedRole === 'STUDENT' ? 'Student@2026' : 'Faculty@2026'),
        selectedRole
      );
      if (res && res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('college_erp_user', JSON.stringify(res.user));
        return true;
      }
    } catch {
      // Backend unavailable or rejected, proceed with prototype session fallback
    }

    let loggedUser: AuthUser;
    if (selectedRole === 'STUDENT') {
      loggedUser = {
        ...STUDENT_PROFILE,
        email: identifier.includes('@') ? identifier : `${identifier}@college.edu`
      };
    } else {
      loggedUser = {
        ...FACULTY_PROFILE,
        email: identifier.includes('@') ? identifier : `${identifier}@college.edu`
      };
    }

    setUser(loggedUser);
    localStorage.setItem('college_erp_user', JSON.stringify(loggedUser));
    return true;
  };

  const logout = () => {
    api.logout();
    setUser(null);
    localStorage.removeItem('college_erp_user');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
