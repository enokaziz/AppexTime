export type UserRole = 'admin' | 'manager' | 'employee';

export interface UserPermissions {
  dashboard: boolean;
  manageEmployees: boolean;
  scanQR: boolean;
  modifySettings: boolean;
  viewSensitiveData: boolean;
}

export const Permissions: Record<Uppercase<UserRole>, UserPermissions> = {
  ADMIN: {
    dashboard: true,
    manageEmployees: true,
    scanQR: false,
    modifySettings: true,
    viewSensitiveData: true,
  },
  MANAGER: {
    dashboard: true,
    manageEmployees: true,
    scanQR: true,
    modifySettings: false,
    viewSensitiveData: true,
  },
  EMPLOYEE: {
    dashboard: false,
    manageEmployees: false,
    scanQR: false,
    modifySettings: false,
    viewSensitiveData: false,
  },
};

export const checkPermissions = (
  role: UserRole,
  permission: keyof UserPermissions,
): boolean => {
  if (!role) return false;
  return Permissions[role.toUpperCase() as Uppercase<UserRole>][permission];
};
