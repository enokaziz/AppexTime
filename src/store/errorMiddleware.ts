import { Middleware } from '@reduxjs/toolkit';
import { useToast } from '../hooks/useToast';

const errorMiddleware: Middleware = (store) => (next) => (action) => {
  const actionTyped = action as { type: string; error?: boolean; payload?: any; };
  if (actionTyped.error) {
    const toast = useToast();
    toast.error(actionTyped.payload?.message || 'Une erreur est survenue');
  }
  return next(action);
};

export default errorMiddleware;
