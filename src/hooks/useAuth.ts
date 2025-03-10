import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const useAuth = () => {
  const [user, setUser] = useState<{ user: User | null; role: string | null }>({ user: null, role: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setUser({ user, role: userData?.role || null });
      } else {
        setUser({ user: null, role: null });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      setUser({ user: userCredential.user, role: userData?.role || null });
    } catch (error) {
      throw new Error((error as Error).message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error((error as Error).message || 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser({ user: null, role: null });
    } catch (error) {
      throw new Error((error as Error).message || 'Logout failed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error((error as Error).message || 'Reset password failed');
    }
  };

  return {
    user,
    login,
    signup,
    logout,
    resetPassword,
  };
};

export default useAuth;