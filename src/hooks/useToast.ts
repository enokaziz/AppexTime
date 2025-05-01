import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { showToast } from '../store/slices/uiSlice';
import Toast from 'react-native-toast-message';

interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  position?: 'top' | 'bottom';
  visibilityTime?: number;
}

export const useToast = () => {
  const dispatch = useAppDispatch();

  const show = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    Toast.show({
      type,
      text1: type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : 'Information',
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });

    dispatch(showToast({
      message,
      type
    }));
  }, [dispatch]);

  return {
    success: (message: string) => show('success', message),
    error: (message: string) => show('error', message),
    info: (message: string) => show('info', message),
  };
};
