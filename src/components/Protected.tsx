import React from 'react';
import { View, Text } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { checkPermissions, UserPermissions } from '../types/Permissions';

interface ProtectedProps {
  permission: keyof UserPermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({
  permission,
  children,
  fallback = <Text>Accès refusé</Text>,
}) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !user.role || !checkPermissions(user.role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default Protected;
