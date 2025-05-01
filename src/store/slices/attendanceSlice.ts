import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc
} from 'firebase/firestore';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  companyId: string;
  checkInTime: Timestamp;
  checkOutTime?: Timestamp;
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'present' | 'late' | 'absent' | 'overtime';
  verificationMethod: 'qr' | 'facial';
}

interface AttendanceState {
  records: AttendanceRecord[];
  currentRecord: AttendanceRecord | null;
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  currentRecord: null,
  loading: false,
  error: null,
};

export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async ({ 
    employeeId, 
    companyId, 
    location,
    verificationMethod 
  }: { 
    employeeId: string;
    companyId: string;
    location?: { latitude: number; longitude: number };
    verificationMethod: 'qr' | 'facial';
  }) => {
    try {
      const checkInTime = Timestamp.now();
      
      // Determine if the check-in is late based on company policy
      // This should be implemented based on your business logic
      const status: 'present' | 'late' | 'absent' | 'overtime' = 'present'; // Type explicite ajouté

      const attendanceData = {
        employeeId,
        companyId,
        checkInTime,
        location,
        status,
        verificationMethod,
      };

      const docRef = await addDoc(collection(db, 'attendance'), attendanceData);
      
      return {
        id: docRef.id,
        ...attendanceData,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async ({ 
    recordId,
    location 
  }: { 
    recordId: string;
    location?: { latitude: number; longitude: number };
  }) => {
    try {
      const checkOutTime = Timestamp.now();
      const attendanceRef = doc(db, 'attendance', recordId);
      
      // Calculate overtime status if applicable
      // This should be implemented based on your business logic
      
      await updateDoc(attendanceRef, {
        checkOutTime,
        location,
      });

      return {
        recordId,
        checkOutTime,
        location,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchRecords',
  async ({ 
    companyId,
    employeeId,
    startDate,
    endDate 
  }: { 
    companyId: string;
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    try {
      let q = query(
        collection(db, 'attendance'),
        where('companyId', '==', companyId)
      );

      if (employeeId) {
        q = query(q, where('employeeId', '==', employeeId));
      }

      if (startDate) {
        q = query(q, where('checkInTime', '>=', Timestamp.fromDate(startDate)));
      }

      if (endDate) {
        q = query(q, where('checkInTime', '<=', Timestamp.fromDate(endDate)));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AttendanceRecord[];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check In
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecord = action.payload;
        state.records.push(action.payload);
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du pointage d\'entrée';
      })
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(record => record.id === action.payload.recordId);
        if (index !== -1) {
          state.records[index] = {
            ...state.records[index],
            checkOutTime: action.payload.checkOutTime,
            location: action.payload.location,
          };
        }
        state.currentRecord = null;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du pointage de sortie';
      })
      // Fetch Records
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la récupération des pointages';
      });
  },
});

export const { clearCurrentRecord, clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
