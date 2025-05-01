import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface Absence {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: string;
}

interface AbsenceState {
  list: Absence[];
  loading: boolean;
  error: string | null;
}

const initialState: AbsenceState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchAbsences = createAsyncThunk(
  'absence/fetchAbsences',
  async ({ page, refresh = false }: { page: number; refresh?: boolean }, { getState }) => {
    // Implémentez ici la logique de récupération des données
    // Par exemple, un appel API
    return [];
  }
);

const absenceSlice = createSlice({
  name: 'absence',
  initialState,
  reducers: {
    addAbsence: (state, action: PayloadAction<Absence>) => {
      state.list.push(action.payload);
    },
    removeAbsence: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(absence => absence.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbsences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbsences.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAbsences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch absences';
      });
  },
});

export const { addAbsence, removeAbsence } = absenceSlice.actions;

export default absenceSlice.reducer;
