import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '../../types';
import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

export interface UpdateTaskStatusPayload {
  taskId: string;
  status: 'pending' | 'in_progress' | 'completed';
  employeeId: string;
}

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number }) => {
    try {
      // Ici, vous pourriez ajouter une logique pour paginer dans Firebase
      // Par exemple : 
      // const query = query(collection(db, 'tasks'), 
      //   orderBy('createdAt', 'desc'),
      //   limit(pageSize),
      //   startAfter(lastDoc)
      // );
      // const snapshot = await getDocs(query);
      // const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // const totalItems = await getCountFromServer(collection(db, 'tasks'));
      
      // Pour l'exemple, on retourne des données simulées
      return {
        tasks: [],
        totalItems: 0,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'task/updateTaskStatus',
  async (payload: UpdateTaskStatusPayload) => {
    try {
      // Ici, vous pourriez ajouter une logique pour mettre à jour dans Firebase
      // Par exemple : await updateDoc(doc(db, 'tasks', payload.taskId), { status: payload.status });
      return payload;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      state.pagination.totalItems++;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
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
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.pagination.totalItems = action.payload.totalItems;
        state.pagination.totalPages = Math.ceil(action.payload.totalItems / state.pagination.pageSize);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement des tâches';
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, status } = action.payload;
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = status;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la mise à jour du statut';
      });
  },
});

export const { setTasks, addTask, deleteTask, setPage, setPageSize } = taskSlice.actions;
export default taskSlice.reducer;
