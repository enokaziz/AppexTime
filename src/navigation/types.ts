import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

export type AuthStackParamList = {
  Home: undefined;
  Attendance: undefined;
  
  QRScanner: undefined;
  FaceRecognition: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Main: { screen: string };
  AdminDashboard: undefined;
  ManagerDashboard: undefined;
  Dashboard: undefined;
  CreateResponsible: undefined;
  LiveChat: undefined;
  KnowledgeBase: undefined;
  EditEmployee: { employeeId?: string };
  EmployeeList: undefined;
  AddEmployee: undefined;
  EmployeePerformance: undefined;
  EmployeePortal: undefined;
  EmployeeHistory: undefined;
  Absence: undefined;
  AbsenceManagement: undefined;
  LeaveManagement: undefined;
  SubmitLeave: undefined;
  Overtime: undefined;
  OvertimeManagement: undefined;
  Payroll: undefined;
  GenerateReport: undefined;
  TeamPerformance: undefined;
  Support: undefined;
  CompanySettings: undefined;
  BenefitsManagement: undefined;
  TaskManagement: undefined;
  Loading: undefined;
  Error: undefined;
  GenerateBadge: {employee:Employee};
};

export type EditEmployeeScreenProps = StackScreenProps<AuthStackParamList, 'EditEmployee'>;

export type AuthScreenNavigationProp<T extends keyof AuthStackParamList> = StackNavigationProp<AuthStackParamList, T>;

export interface Employee {
  id: string;
  name: string;
  firstName: string;
  phoneNumber: string;
  photo?: string; // Optional field for employee photo
  companyInitials: string;
  qrCodeUrl: string;
  uniqueId: string;
}