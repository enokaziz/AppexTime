import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import attendanceReducer from './slices/attendanceSlice';
import uiReducer from './slices/uiSlice';
import leaveReducer from './slices/leaveSlice';
import taskReducer from './slices/taskSlice';
import absenceReducer from './slices/absenceSlice';
import errorMiddleware from './errorMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const rootReducer = {
  auth: authReducer,
  employee: employeeReducer,
  attendance: attendanceReducer,
  ui: uiReducer,
  leave: leaveReducer,
  task: taskReducer,
  absence: absenceReducer,
};

// Création explicite du store avec vérification
const createStore = () => {
  try {
    return configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }).concat(errorMiddleware, authMiddleware),
    });
  } catch (error) {
    console.error('Failed to create Redux store:', error);
    throw error;
  }
};

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
