import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db, storage } from '../../config/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Employee,
  PhotoData,
  UpdateEmployeePayload,
} from '../../types/employee';

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

export const addEmployee = createAsyncThunk(
  'employee/add',
  async ({
    employeeData,
    photoData,
  }: {
    employeeData: Omit<Employee, 'id' | 'photoUrl' | 'createdAt' | 'updatedAt'>;
    photoData: PhotoData;
  }) => {
    try {
      // Upload photo
      const photoRef = ref(
        storage,
        `employees/${Date.now()}_${photoData.name}`,
      );
      const response = await fetch(photoData.uri);
      const blob = await response.blob();
      await uploadBytes(photoRef, blob);
      const photoUrl = await getDownloadURL(photoRef);

      const timestamp = Timestamp.now();

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'employees'), {
        ...employeeData,
        photoUrl,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      return {
        id: docRef.id,
        ...employeeData,
        photoUrl,
        createdAt: timestamp.toDate().toISOString(),
        updatedAt: timestamp.toDate().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
);

export const updateEmployee = createAsyncThunk(
  'employee/update',
  async ({ id, employeeData, photoData }: UpdateEmployeePayload) => {
    try {
      let photoUrl: string | undefined;

      if (photoData) {
        const photoRef = ref(
          storage,
          `employees/${Date.now()}_${photoData.name}`,
        );
        const response = await fetch(photoData.uri);
        const blob = await response.blob();
        await uploadBytes(photoRef, blob);
        photoUrl = await getDownloadURL(photoRef);
      }

      const timestamp = Timestamp.now();
      const employeeRef = doc(db, 'employees', id);

      const updateData = {
        ...employeeData,
        ...(photoUrl && { photoUrl }),
        updatedAt: timestamp,
      };

      await updateDoc(employeeRef, updateData);

      return {
        id,
        ...employeeData,
        ...(photoUrl && { photoUrl }),
        updatedAt: timestamp.toDate().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
);

export const deleteEmployee = createAsyncThunk(
  'employee/delete',
  async (id: string) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
      return id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
);

export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async ({
    page = 1,
    pageSize = 10,
    companyId,
  }: {
    page?: number;
    pageSize?: number;
    companyId: string;
  }) => {
    try {
      const lastDoc = await getLastDocFromServer(
        db,
        'employees',
        page,
        pageSize,
      );
      const q = query(
        collection(db, 'employees'),
        where('companyId', '==', companyId),
        orderBy('createdAt', 'desc'),
        limit(pageSize),
        startAfter(lastDoc),
      );
      const querySnapshot = await getDocs(q);
      const employees = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
        name: doc.data().name,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        phone: doc.data().phone,
        photoUrl: doc.data().photoUrl,
        employeeId: doc.data().employeeId,
        companyId: doc.data().companyId,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt,
      }));
      const totalItems = await getCollectionCount(collection(db, 'employees'));

      return {
        employees,
        totalItems,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
);

const getLastDocFromServer = async (
  db: any,
  collectionName: string,
  page: number,
  pageSize: number,
) => {
  const firstPage = page === 1;
  if (firstPage) {
    return null;
  }
  const offset = (page - 1) * pageSize;
  const q = query(
    collection(db, collectionName),
    orderBy('createdAt', 'desc'),
    limit(offset + 1),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[offset];
};

const getCollectionCount = async (collectionRef: any) => {
  const snapshot = await getDocs(collectionRef);
  return snapshot.size;
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeList: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    addNewEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
      state.pagination.totalItems++;
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(
        (employee) => employee.id !== action.payload,
      );
      state.pagination.totalItems--;
    },
    updateExistingEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(
        (employee) => employee.id === action.payload.id,
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.pagination.totalItems = action.payload.totalItems;
        state.pagination.totalPages = Math.ceil(
          action.payload.totalItems / state.pagination.pageSize,
        );
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erreur lors du chargement des employés';
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(
          (employee) => employee.id !== action.payload,
        );
        state.pagination.totalItems--;
      });
  },
});

export const {
  setEmployeeList,
  addNewEmployee,
  removeEmployee,
  updateExistingEmployee,
  setCurrentPage,
  setItemsPerPage,
} = employeeSlice.actions;
export default employeeSlice.reducer;
