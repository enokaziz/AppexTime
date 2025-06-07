import { User } from 'firebase/auth';
import { UserRole } from './Permissions';

export interface CustomUser extends User {
  companyId: string;
  role: UserRole;
  managedEmployees?: string[];
}

export interface AuthState {
  user: CustomUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
