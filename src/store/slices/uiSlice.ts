import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface UIState {
  isLoading: boolean;
  toast: Toast | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  currentModal: string | null;
  offlineMode: boolean;
}

const initialState: UIState = {
  isLoading: false,
  toast: null,
  theme: 'light',
  sidebarOpen: true,
  currentModal: null,
  offlineMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action: PayloadAction<Toast>) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentModal: (state, action: PayloadAction<string | null>) => {
      state.currentModal = action.payload;
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload;
    },
  },
});

export const {
  setLoading,
  showToast,
  clearToast,
  toggleTheme,
  setSidebarOpen,
  setCurrentModal,
  setOfflineMode,
} = uiSlice.actions;

export default uiSlice.reducer;
