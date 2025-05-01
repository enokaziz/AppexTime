import { Middleware, Action } from '@reduxjs/toolkit';
import {
  UserRole,
  UserPermissions,
  checkPermissions,
} from '../types/Permissions';

interface PermissionAction extends Action {
  meta: {
    requiresPermission: keyof UserPermissions;
  };
}

export const authMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    if (action.meta?.requiresPermission) {
      const { auth } = store.getState();
      if (!auth.user) {
        console.warn(`User not authenticated for ${action.type}`);
        return;
      }
      
      const hasPermission = checkPermissions(
        auth.user.role,
        action.meta.requiresPermission,
      );

      if (!hasPermission) {
        console.warn(`Permission denied for ${action.type}`);
        return;
      }
    }

    return next(action);
  };

export const withPermission = <T extends Action>(
  permission: keyof UserPermissions,
  action: T,
): T & { meta: { requiresPermission: keyof UserPermissions } } => ({
  ...action,
  meta: {
    ...(action as any).meta,
    requiresPermission: permission,
  },
});
