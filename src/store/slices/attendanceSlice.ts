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
  doc,
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
  justification?: string; // Ajout du champ justification
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
  async (
    {
      employeeId,
      companyId,
      location,
      verificationMethod,
      justification,
    }: {
      employeeId: string;
      companyId: string;
      location?: { latitude: number; longitude: number };
      verificationMethod: 'qr' | 'facial';
      justification?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      // Vérifier s'il y a déjà un check-in sans check-out pour aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const q = query(
        collection(db, 'attendance'),
        where('employeeId', '==', employeeId),
        where('companyId', '==', companyId),
        where('checkInTime', '>=', Timestamp.fromDate(today)),
        where('checkInTime', '<', Timestamp.fromDate(tomorrow)),
      );
      const snapshot = await getDocs(q);
      const openRecord = snapshot.docs.find((doc) => !doc.data().checkOutTime);
      if (openRecord) {
        return rejectWithValue(
          'Vous avez déjà pointé sans avoir fait de check-out.',
        );
      }

      const checkInTime = Timestamp.now();
      // Heure limite de check-in (08:00)
      const limitHour = 8;
      const checkInDate = checkInTime.toDate();
      let status: 'present' | 'late' | 'absent' | 'overtime' = 'present';
      let justificationValue = justification;
      if (
        checkInDate.getHours() > limitHour ||
        (checkInDate.getHours() === limitHour && checkInDate.getMinutes() > 0)
      ) {
        status = 'late';
      }
      // Si l'utilisateur souhaite justifier son retard, il peut passer justification
      const attendanceData = {
        employeeId,
        companyId,
        checkInTime,
        location,
        status,
        verificationMethod,
        justification: justificationValue || undefined,
      };
      const docRef = await addDoc(collection(db, 'attendance'), attendanceData);
      return {
        id: docRef.id,
        ...attendanceData,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (
    {
      employeeId,
      companyId,
      location,
    }: {
      employeeId: string;
      companyId: string;
      location?: { latitude: number; longitude: number };
    },
    { rejectWithValue },
  ) => {
    try {
      // Vérifier qu'il existe un check-in sans check-out pour aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const q = query(
        collection(db, 'attendance'),
        where('employeeId', '==', employeeId),
        where('companyId', '==', companyId),
        where('checkInTime', '>=', Timestamp.fromDate(today)),
        where('checkInTime', '<', Timestamp.fromDate(tomorrow)),
      );
      const snapshot = await getDocs(q);
      const openRecord = snapshot.docs.find((doc) => !doc.data().checkOutTime);
      if (!openRecord) {
        return rejectWithValue("Aucun check-in trouvé pour aujourd'hui.");
      }
      const recordId = openRecord.id;
      const checkOutTime = Timestamp.now();
      const attendanceRef = doc(db, 'attendance', recordId);
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
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchRecords',
  async ({
    companyId,
    employeeId,
    startDate,
    endDate,
  }: {
    companyId: string;
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    try {
      let q = query(
        collection(db, 'attendance'),
        where('companyId', '==', companyId),
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
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AttendanceRecord[];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
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
        state.error =
          action.error.message || "Erreur lors du pointage d'entrée";
      })
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(
          (record) => record.id === action.payload.recordId,
        );
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
        state.error =
          action.error.message || 'Erreur lors du pointage de sortie';
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
        state.error =
          action.error.message ||
          'Erreur lors de la récupération des pointages';
      });
  },
});

export const { clearCurrentRecord, clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
