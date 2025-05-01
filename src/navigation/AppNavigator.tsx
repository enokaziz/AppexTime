import React, { lazy, Suspense } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import LoadingScreen from '../screens/LoadingScreen';

// Lazy loaded screens
const HomeScreen = lazy(() => import('../screens/HomeScreen'));
const LoginScreen = lazy(() => import('../screens/Auth/LoginScreen'));
const SignupScreen = lazy(() => import('../screens/Auth/SignupScreen'));
const ForgotPasswordScreen = lazy(() => import('../screens/Auth/ForgotPasswordScreen'));
const AttendanceScreen = lazy(() => import('../screens/AttendanceScreen'));
const GenerateBadgeScreen = lazy(() => import('../screens/GenerateBadgeScreen'));
const QRScannerScreen = lazy(() => import('../screens/QRScannerScreen'));
const FaceRecognitionScreen = lazy(() => import('../screens/FaceRecognitionScreen'));
const EmployeeListScreen = lazy(() => import('../screens/employee/EmployeeListScreen'));
const AddEmployeeScreen = lazy(() => import('../screens/employee/AddEmployeeScreen'));
const EditEmployeeScreen = lazy(() => import('../screens/employee/EditEmployeeScreen'));
const EmployeePerformanceScreen = lazy(() => import('../screens/employee/EmployeePerformanceScreen'));
const EmployeePortalScreen = lazy(() => import('../screens/employee/EmployeePortalScreen'));
const EmployeeHistoryScreen = lazy(() => import('../screens/employee/EmployeeHistoryScreen'));
const AbsenceScreen = lazy(() => import('../screens/AbsenceScreen'));
const AbsenceManagementScreen = lazy(() => import('../screens/AbsenceManagementScreen'));
const LeaveManagementScreen = lazy(() => import('../screens/LeaveManagementScreen'));
const SubmitLeaveScreen = lazy(() => import('../screens/SubmitLeaveScreen'));
const OvertimeScreen = lazy(() => import('../screens/OvertimeScreen'));
const OvertimeManagementScreen = lazy(() => import('../screens/OvertimeManagementScreen'));
const PayrollScreen = lazy(() => import('../screens/PayrollScreen'));
const GenerateReportScreen = lazy(() => import('../screens/GenerateReportScreen'));
const TeamPerformanceScreen = lazy(() => import('../screens/TeamPerformanceScreen'));
const SupportScreen = lazy(() => import('../screens/SupportScreen'));
const CompanySettingsScreen = lazy(() => import('../screens/CompanySettingsScreen'));
const BenefitsManagementScreen = lazy(() => import('../screens/BenefitsManagementScreen'));
const TaskManagementScreen = lazy(() => import('../screens/TaskManagementScreen'));
const CreateResponsibleScreen = lazy(() => import('../screens/CreateResponsibleScreen'));
const LiveChatScreen = lazy(() => import('../screens/LiveChatScreen'));
const KnowledgeBaseScreen = lazy(() => import('../screens/KnowledgeBaseScreen'));
const ErrorScreen = lazy(() => import('../screens/ErrorScreen'));
const ManagerDashboardScreen = lazy(() => import('../screens/ManagerDashboardScreen'));
const DashboardScreen = lazy(() => import('../screens/DashboardScreen'));
const AdminDashboardScreen = lazy(() => import('../screens/AdminDashboardScreen'));

const Stack = createStackNavigator<AuthStackParamList>();

// Wrapper pour les composants lazy-loaded
const LazyComponent = (Component: React.LazyExoticComponent<any>): React.FC => {
  return (props) => (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={LazyComponent(HomeScreen)} />
      <Stack.Screen name="Login" component={LazyComponent(LoginScreen)} />
      <Stack.Screen name="Signup" component={LazyComponent(SignupScreen)} />
      <Stack.Screen name="ForgotPassword" component={LazyComponent(ForgotPasswordScreen)} />
      <Stack.Screen name="Attendance" component={LazyComponent(AttendanceScreen)} />
      <Stack.Screen name="GenerateBadge" component={LazyComponent(GenerateBadgeScreen)} />
      <Stack.Screen name="QRScanner" component={LazyComponent(QRScannerScreen)} />
      <Stack.Screen name="FaceRecognition" component={LazyComponent(FaceRecognitionScreen)} />
      <Stack.Screen name="EmployeeList" component={LazyComponent(EmployeeListScreen)} />
      <Stack.Screen name="AddEmployee" component={LazyComponent(AddEmployeeScreen) as React.ComponentType<{}>} />
      <Stack.Screen name="EditEmployee" component={LazyComponent(EditEmployeeScreen)} initialParams={{ employeeId: '' }} />
      <Stack.Screen name="EmployeePerformance" component={LazyComponent(EmployeePerformanceScreen)} />
      <Stack.Screen name="EmployeePortal" component={LazyComponent(EmployeePortalScreen)} />
      <Stack.Screen name="EmployeeHistory" component={LazyComponent(EmployeeHistoryScreen)} />
      <Stack.Screen name="Absence" component={LazyComponent(AbsenceScreen)} />
      <Stack.Screen name="AbsenceManagement" component={LazyComponent(AbsenceManagementScreen)} />
      <Stack.Screen name="LeaveManagement" component={LazyComponent(LeaveManagementScreen)} />
      <Stack.Screen name="SubmitLeave" component={LazyComponent(SubmitLeaveScreen)} />
      <Stack.Screen name="Overtime" component={LazyComponent(OvertimeScreen)} />
      <Stack.Screen name="OvertimeManagement" component={LazyComponent(OvertimeManagementScreen)} />
      <Stack.Screen name="Payroll" component={LazyComponent(PayrollScreen)} />
      <Stack.Screen name="GenerateReport" component={LazyComponent(GenerateReportScreen)} />
      <Stack.Screen name="TeamPerformance" component={LazyComponent(TeamPerformanceScreen)} />
      <Stack.Screen name="Support" component={LazyComponent(SupportScreen)} />
      <Stack.Screen name="CompanySettings" component={LazyComponent(CompanySettingsScreen)} />
      <Stack.Screen name="BenefitsManagement" component={LazyComponent(BenefitsManagementScreen)} />
      <Stack.Screen name="TaskManagement" component={LazyComponent(TaskManagementScreen)} />
      <Stack.Screen name="CreateResponsible" component={LazyComponent(CreateResponsibleScreen)} />
      <Stack.Screen name="LiveChat" component={LazyComponent(LiveChatScreen)} />
      <Stack.Screen name="KnowledgeBase" component={LazyComponent(KnowledgeBaseScreen)} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Error" component={LazyComponent(ErrorScreen)} />
      <Stack.Screen name="AdminDashboard" component={LazyComponent(AdminDashboardScreen)} />
      <Stack.Screen name="ManagerDashboard" component={LazyComponent(ManagerDashboardScreen)} />
      <Stack.Screen name="Dashboard" component={LazyComponent(DashboardScreen)} />
    </Stack.Navigator>
  );
};

export default AppNavigator;