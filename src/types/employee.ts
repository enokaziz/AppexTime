import { ReactNode } from 'react';

export interface Employee {
  email: ReactNode;
  name: ReactNode;
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl?: string;
  employeeId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoData {
  uri: string;
  type: string;
  name: string;
}

export interface UpdateEmployeePayload {
  id: string;
  employeeData: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  photoData?: PhotoData;
}
