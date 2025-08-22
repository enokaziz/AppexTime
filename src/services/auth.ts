import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export const login = async (
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; userData?: any }> => {
  if (!email || !password)
    return { success: false, error: 'Email and password are required' };
  try {
    console.log('🔐 Tentative de connexion pour:', email);

    // Connexion Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    console.log('✅ Connexion Firebase réussie, UID:', user.uid);

    // Récupération des données utilisateur depuis Firestore
    console.log('📖 Récupération des données utilisateur depuis Firestore...');
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('✅ Données utilisateur récupérées:', userData);

      return {
        success: true,
        userData: {
          uid: user.uid,
          email: user.email,
          role: userData.role || 'employee',
          createdAt: userData.createdAt,
          status: userData.status || 'active',
        },
      };
    } else {
      console.log(
        '⚠️ Document utilisateur non trouvé dans Firestore, création...',
      );

      // Créer le document utilisateur s'il n'existe pas
      await setDoc(doc(db, 'users', user.uid), {
        role: 'employee',
        email: user.email,
        createdAt: new Date().toISOString(),
        status: 'active',
      });

      console.log('✅ Document utilisateur créé avec rôle par défaut');

      return {
        success: true,
        userData: {
          uid: user.uid,
          email: user.email,
          role: 'employee',
          createdAt: new Date().toISOString(),
          status: 'active',
        },
      };
    }
  } catch (error) {
    console.error('💥 Erreur lors de la connexion:', error);

    const errorCode = (error as any).code;
    let errorMessage = 'Échec de la connexion';

    if (errorCode === 'auth/user-not-found') {
      errorMessage = 'Utilisateur non trouvé';
    } else if (errorCode === 'auth/wrong-password') {
      errorMessage = 'Mot de passe incorrect';
    } else if (errorCode === 'auth/invalid-email') {
      errorMessage = "Format d'email invalide";
    } else if (errorCode === 'auth/network-request-failed') {
      errorMessage =
        'Erreur de connexion réseau. Vérifiez votre connexion internet';
    } else if (errorCode === 'auth/too-many-requests') {
      errorMessage = 'Trop de tentatives. Réessayez plus tard';
    }

    return { success: false, error: errorMessage };
  }
};

export const register = async (
  email: string,
  password: string,
  role: string,
): Promise<{ success: boolean; error?: string }> => {
  if (!email || !password)
    return { success: false, error: 'Email and password are required' };
  if (password.length < 6)
    return { success: false, error: 'Password must be at least 6 characters' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { success: false, error: 'Invalid email format' };

  // Validation du rôle
  if (!['employee', 'manager', 'admin'].includes(role)) {
    return { success: false, error: 'Invalid role specified' };
  }

  try {
    console.log("🔥 Création de l'utilisateur Firebase...");

    // Timeout de 30 secondes pour éviter le blocage
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('Timeout: Operation took too long')),
        30000,
      );
    });

    const registrationPromise = createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const userCredential = await Promise.race([
      registrationPromise,
      timeoutPromise,
    ]);
    const user = userCredential.user;

    console.log('✅ Utilisateur Firebase créé, UID:', user.uid);
    console.log('📝 Sauvegarde du rôle dans Firestore...');

    await setDoc(doc(db, 'users', user.uid), {
      role,
      email: user.email,
      createdAt: new Date().toISOString(),
      status: 'active',
    });

    console.log('✅ Rôle sauvegardé dans Firestore');
    return { success: true };
  } catch (error) {
    console.error("💥 Erreur lors de l'inscription:", error);

    const errorCode = (error as any).code;
    let errorMessage = 'Registration failed';

    if (errorCode === 'auth/email-already-in-use') {
      errorMessage = 'Cette adresse email est déjà utilisée';
    } else if (errorCode === 'auth/invalid-email') {
      errorMessage = "Format d'email invalide";
    } else if (errorCode === 'auth/weak-password') {
      errorMessage = 'Le mot de passe est trop faible';
    } else if (errorCode === 'auth/network-request-failed') {
      errorMessage =
        'Erreur de connexion réseau. Vérifiez votre connexion internet';
    } else if (error.message === 'Timeout: Operation took too long') {
      errorMessage =
        "L'opération a pris trop de temps. Vérifiez votre connexion internet";
    }

    return { success: false, error: errorMessage };
  }
};

export const resetPassword = async (
  email: string,
): Promise<{ success: boolean; error?: string }> => {
  if (!email) return { success: false, error: 'Email is required' };
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: (error as Error).message || 'Reset password failed',
    };
  }
};

export const createResponsible = async (
  email: string,
  password: string,
  currentUserRole: string,
): Promise<{ success: boolean; error?: string }> => {
  if (currentUserRole !== 'admin')
    return {
      success: false,
      error: 'Only admins can create responsible accounts',
    };
  if (!email || !password)
    return { success: false, error: 'Email and password are required' };
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), { role: 'Responsable' });
    return { success: true };
  } catch (error) {
    console.error('Create responsible error:', error);
    return {
      success: false,
      error: (error as Error).message || 'Failed to create responsible',
    };
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
