import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Leave, LeaveStatus } from '../../types';
import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

interface LeaveState {
  leaves: Leave[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: LeaveState = {
  leaves: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

export interface UpdateLeaveStatusPayload {
  leaveId: string;
  status: 'approved' | 'rejected' | 'pending';
  employeeId: string; 
}

export const updateLeaveStatus = createAsyncThunk(
  'leave/updateLeaveStatus',
  async (payload: UpdateLeaveStatusPayload) => {
    try {
      // Ici, vous pourriez ajouter une logique pour mettre à jour dans Firebase
      // Par exemple : await updateDoc(doc(db, 'leaves', payload.leaveId), { status: payload.status });
      return payload;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const fetchLeaves = createAsyncThunk(
  'leave/fetchLeaves',
  async ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number }) => {
    try {
      // Ici, vous pourriez ajouter une logique pour paginer dans Firebase
      // Par exemple : 
      // const query = query(collection(db, 'leaves'), 
      //   orderBy('createdAt', 'desc'),
      //   limit(pageSize),
      //   startAfter(lastDoc)
      // );
      // const snapshot = await getDocs(query);
      // const leaves = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // const totalItems = await getCountFromServer(collection(db, 'leaves'));
      
      // Pour l'exemple, on retourne des données simulées
      return {
        leaves: [],
        totalItems: 0,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setLeaves: (state, action: PayloadAction<Leave[]>) => {
      state.leaves = action.payload;
    },
    addLeave: (state, action: PayloadAction<Leave>) => {
      state.leaves.push(action.payload);
      state.pagination.totalItems++;
    },
    deleteLeave: (state, action: PayloadAction<string>) => {
      state.leaves = state.leaves.filter(leave => leave.id !== action.payload);
      state.pagination.totalItems--;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.leaves;
        state.pagination.totalItems = action.payload.totalItems;
        state.pagination.totalPages = Math.ceil(action.payload.totalItems / state.pagination.pageSize);
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement des congés';
      })
      .addCase(updateLeaveStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { leaveId, status } = action.payload;
        const leave = state.leaves.find(l => l.id === leaveId);
        if (leave) {
          leave.status = status;
        }
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la mise à jour du statut';
      });
  },
});

export const { setLeaves, addLeave, deleteLeave, setPage, setPageSize } = leaveSlice.actions;
export default leaveSlice.reducer;
