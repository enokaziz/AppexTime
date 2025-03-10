import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  if (!email || !password) return { success: false, error: 'Email and password are required' };
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    const errorCode = (error as any).code;
    let errorMessage = 'Login failed';
    if (errorCode === 'auth/user-not-found') errorMessage = 'User not found';
    else if (errorCode === 'auth/wrong-password') errorMessage = 'Incorrect password';
    console.error('Login error:', error);
    return { success: false, error: errorMessage };
  }
};

export const register = async (email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
  if (!email || !password) return { success: false, error: 'Email and password are required' };
  if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Invalid email format' };
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), { role });
    return { success: true };
  } catch (error) {
    const errorCode = (error as any).code;
    let errorMessage = 'Registration failed';
    if (errorCode === 'auth/email-already-in-use') errorMessage = 'Email already in use';
    console.error('Registration error:', error);
    return { success: false, error: errorMessage };
  }
};

export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  if (!email) return { success: false, error: 'Email is required' };
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: (error as Error).message || 'Reset password failed' };
  }
};

export const createResponsible = async (email: string, password: string, currentUserRole: string): Promise<{ success: boolean; error?: string }> => {
  if (currentUserRole !== 'admin') return { success: false, error: 'Only admins can create responsible accounts' };
  if (!email || !password) return { success: false, error: 'Email and password are required' };
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), { role: 'Responsable' });
    return { success: true };
  } catch (error) {
    console.error('Create responsible error:', error);
    return { success: false, error: (error as Error).message || 'Failed to create responsible' };
  }
};

export const getUserRole = async (userId: string): Promise<string> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data().role;
  } else {
    throw new Error('User not found');
  }
};

export { auth };