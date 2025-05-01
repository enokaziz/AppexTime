import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const permissionsMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const state = store.getState();
  const user = state.auth.user;

  // Vérification du type d'action
  if (!user || typeof action !== 'object' || action === null || !('type' in action)) {
    return next(action);
  }

  // Type narrowing - action est maintenant connu comme un objet avec une propriété 'type'
  const actionType = action.type;

  // Actions nécessitant des permissions d'admin
  const adminActions = [
    'employee/deleteEmployee',
    'leave/updateLeaveStatus',
    'task/updateTaskStatus',
  ];

  // Actions nécessitant des permissions de manager
  const managerActions = ['leave/updateLeaveStatus', 'task/updateTaskStatus'];

  // Vérifier si l'action nécessite des permissions d'admin
  if (typeof actionType === 'string' && adminActions.includes(actionType) && user.role !== 'admin') {
    console.warn(
      `User ${user.email} attempted to perform admin action: ${actionType}`,
    );
    return;
  }

  // Vérifier si l'action nécessite des permissions de manager
  if (typeof actionType === 'string' && managerActions.includes(actionType) && 
      user.role !== 'admin' && 
      user.role !== 'manager') {
    console.warn(
      `User ${user.email} attempted to perform manager action: ${actionType}`,
    );
    return;
  }

  return next(action);
};
