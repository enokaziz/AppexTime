import { ReactNode } from 'react';

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
  status?: string;
  checkInTime?: { seconds: number; nanoseconds: number };
  checkOutTime?: { seconds: number; nanoseconds: number };
  justification?: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  employeeName: string;
  employeeId: string;
  status: TaskStatus;
  dueDate: string;
  completed: boolean;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

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
  design?: BadgeDesign;
  format: BadgeFormat;
  status: BadgeStatus;
}

export interface BadgeDesign {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  logo?: string;
  fontFamily?: string;
  fontSize?: number;
}

export type BadgeFormat = 'PDF' | 'PNG' | 'SVG' | 'JPG';

export type BadgeStatus = 'draft' | 'generated' | 'printed' | 'error';

export interface QRCodeOptions {
  size: number;
  color: string;
  backgroundColor: string;
  logo?: string;
  logoSize?: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  quietZone?: number;
  quietZoneColor?: string;
}

export interface ScanHistory {
  id: string;
  employeeId: string;
  timestamp: string;
  status: 'success' | 'error';
  errorMessage?: string;
  location?: {
    latitude: number;
    longitude: number;
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
