import { ReactNode } from "react";

export interface Employee {
  id: string;
  name: string;
  firstName: string;
  phoneNumber: string;
  photo: string;
  companyInitials: string;
  qrCodeUrl: string; // Nouveau champ pour le code QR
  uniqueId: string; // Nouveau champ pour l'ID unique
}

export interface EmployeeHistory {
  id: string;
  employeeId: string;
  date: string;
  action: 'check-in' | 'check-out';
  location: string;
}

export interface Leave {
  employeeName: any;
  employeeId: ReactNode;
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
}



export interface CompanySetting {
  id: string;
  name: string;
  value: string;
  status: string; // Ajout de la propriété status
}

export interface SupportRequest {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  dueDate: string;
  completed: boolean; // Ajout de la propriété completed
  employeeName: string; // Ajout de la propriété employeeName
  employeeId: string; // Ajout de la propriété employeeId
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

// Report types
export interface Report {
  id: string;
  type: ReportType;
  data: any;
  date: string;
}

export type ReportType = 'monthly' | 'yearly' | 'custom';

// Company settings types
export interface CompanySettings {
  name: string;
  logo: string;
  standardHours: string;
  holidays: string[];
}

// Attendance types
export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  location: string;
}

// Badge types
export interface Badge {
  id: string;
  employeeId: string;
  qrCode: string;
  data: {
    name: string;
    firstName: string;
    phoneNumber: string;
    photo: string;
  };
}

// Benefit types
export interface Benefit {
  id: string;
  name: string;
  description: string;
  status: string; // Ajout de la propriété status
}

// Overtime types
export interface Overtime {
  id: string;
  employeeId: string;
  date: string;
  hours: number;
  reason: string;
}
