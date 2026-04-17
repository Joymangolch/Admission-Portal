import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'candidate' | 'admin' | 'hod' | 'exam' | 'registrar' | 'accounts';

interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (mobile: string, otp: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, { otp: string; user: User }> = {
  '9876543210': {
    otp: '123456',
    user: {
      id: '1',
      name: 'Rahul Sharma',
      mobile: '9876543210',
      email: 'rahul@example.com',
      role: 'candidate'
    }
  },
  '9876543211': {
    otp: '123456',
    user: {
      id: '2',
      name: 'Admin User',
      mobile: '9876543211',
      email: 'admin@mtu.edu.in',
      role: 'admin'
    }
  },
  '9876543212': {
    otp: '123456',
    user: {
      id: '3',
      name: 'Dr. Priya Singh (HOD)',
      mobile: '9876543212',
      email: 'hod.cse@mtu.edu.in',
      role: 'hod'
    }
  },
  '9876543213': {
    otp: '123456',
    user: {
      id: '4',
      name: 'Exam Controller',
      mobile: '9876543213',
      email: 'exam@mtu.edu.in',
      role: 'exam'
    }
  },
  '9876543214': {
    otp: '123456',
    user: {
      id: '5',
      name: 'Registrar',
      mobile: '9876543214',
      email: 'registrar@mtu.edu.in',
      role: 'registrar'
    }
  },
  '9876543215': {
    otp: '123456',
    user: {
      id: '6',
      name: 'Accounts Officer',
      mobile: '9876543215',
      email: 'accounts@mtu.edu.in',
      role: 'accounts'
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (mobile: string, otp: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = MOCK_USERS[mobile];
    if (mockUser && mockUser.otp === otp) {
      setUser(mockUser.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
