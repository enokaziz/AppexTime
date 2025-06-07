import React, { createContext, useContext, useState, useEffect, createRef } from 'react';
import { auth, db } from '../config/firebase';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { NavigationContainerRef, ParamListBase } from '@react-navigation/native';

interface UserData {
  role?: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ role: string | null; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  createResponsible: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = createRef<NavigationContainerRef<ParamListBase>>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoading(true);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          console.log('Rôle récupéré depuis Firestore :', userData.role);
          setRole(userData.role || null);
          // Navigation conditionnelle basée sur le rôle
          if (userData.role === 'admin') {
            navigationRef.current?.navigate('AdminDashboard');
          } else if (userData.role === 'Responsable') {
            navigationRef.current?.navigate('ManagerDashboard');
          } else {
            navigationRef.current?.navigate('Dashboard');
          }
        } else {
          console.error('User document does not exist for user:', user.uid);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ role: string | null; error?: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        if (userData.role) {
          setRole(userData.role);
          return { role: userData.role };
        }
        return { role: null, error: 'No role found for user' };
      }
      return { role: null, error: 'User document not found' };
    } catch (error) {
      console.error('Login error:', error);
      return { role: null, error: (error as Error).message || 'Login failed' };
    }
  };

  const signup = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: (error as Error).message || 'Signup failed' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      setRole(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: (error as Error).message || 'Reset password failed' };
    }
  };

  const createResponsible = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User must be logged in to create a responsible' };
    if (role !== 'admin') return { success: false, error: 'Only admins can create responsible accounts' };
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      await setDoc(doc(db, 'users', newUser.uid), { role: 'Responsable' });
      return { success: true };
    } catch (error) {
      console.error('Create responsible error:', error);
      return { success: false, error: (error as Error).message || 'Failed to create responsible' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, signup, logout, resetPassword, createResponsible }}>
      {children}
    </AuthContext.Provider>
  );
};