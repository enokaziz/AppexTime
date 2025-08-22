import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth, db } from '../../config/firebase';
import {
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import * as authService from '../../services/auth';
import { UserRole } from '../../types/Permissions';

interface AuthState {
  user: {
    id: string;
    email: string;
    role: UserRole;
    managedEmployees?: string[];
    companyId: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    const { success, error, userData } = await authService.login(
      email,
      password,
    );
    if (!success) {
      return rejectWithValue(error);
    }

    console.log('🚀 loginUser thunk - Données utilisateur reçues:', userData);
    return userData;
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    {
      email,
      password,
      role,
    }: { email: string; password: string; role: string },
    { rejectWithValue },
  ) => {
    const { success, error } = await authService.register(
      email,
      password,
      role,
    );
    if (!success) {
      return rejectWithValue(error);
    }

    // Récupérer l'utilisateur créé avec ses données complètes
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: user.uid,
          email: user.email,
          role: userData.role,
          createdAt: userData.createdAt,
          status: userData.status,
        };
      }
    }

    return user;
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await signOut(auth);
});

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    const { success, error } = await authService.resetPassword(email);
    if (!success) {
      return rejectWithValue(error);
    }
    return true;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: {
          id: string;
          email: string;
          role: UserRole;
          managedEmployees?: string[];
          companyId: string;
        };
        token: string | null;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        console.log('✅ loginUser fulfilled - Payload reçu:', action.payload);

        if (action.payload && action.payload.uid && action.payload.email) {
          state.user = {
            id: action.payload.uid,
            email: action.payload.email,
            role: action.payload.role || 'employee', // ✅ Utilise le vrai rôle !
            managedEmployees: [],
            companyId: '',
          };

          console.log(
            '🎯 Utilisateur connecté avec rôle:',
            action.payload.role,
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log('✅ registerUser fulfilled, payload:', action.payload);

        if (action.payload && action.payload.uid && action.payload.email) {
          state.user = {
            id: action.payload.uid,
            email: action.payload.email,
            role: action.payload.role || 'employee', // ✅ Utilise le vrai rôle !
            managedEmployees: [],
            companyId: '',
          };

          console.log('🎯 Utilisateur inscrit avec rôle:', action.payload.role);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        console.log('❌ registerUser rejected, error:', action.error);
        state.error =
          action.error.message ||
          "Une erreur est survenue lors de l'inscription";
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      // Reset Password
      .addCase(resetPassword.rejected, (state, action) => {
        state.error =
          action.error.message || 'Erreur de réinitialisation du mot de passe';
      });
  },
});

export const { setCredentials, clearCredentials, clearError } =
  authSlice.actions;
export default authSlice.reducer;
