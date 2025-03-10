import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import GenerateBadgeScreen from '../screens/GenerateBadgeScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import FaceRecognitionScreen from '../screens/FaceRecognitionScreen';
import EmployeeListScreen from '../screens/employee/EmployeeListScreen';
import AddEmployeeScreen from '../screens/employee/AddEmployeeScreen';
import EditEmployeeScreen from '../screens/employee/EditEmployeeScreen';
import EmployeePerformanceScreen from '../screens/employee/EmployeePerformanceScreen';
import EmployeePortalScreen from '../screens/employee/EmployeePortalScreen';
import EmployeeHistoryScreen from '../screens/employee/EmployeeHistoryScreen';
import AbsenceScreen from '../screens/AbsenceScreen';
import AbsenceManagementScreen from '../screens/AbsenceManagementScreen';
import LeaveManagementScreen from '../screens/LeaveManagementScreen';
import SubmitLeaveScreen from '../screens/SubmitLeaveScreen';
import OvertimeScreen from '../screens/OvertimeScreen';
import OvertimeManagementScreen from '../screens/OvertimeManagementScreen';
import PayrollScreen from '../screens/PayrollScreen';
import GenerateReportScreen from '../screens/GenerateReportScreen';
import TeamPerformanceScreen from '../screens/TeamPerformanceScreen';
import SupportScreen from '../screens/SupportScreen';
import CompanySettingsScreen from '../screens/CompanySettingsScreen';
import BenefitsManagementScreen from '../screens/BenefitsManagementScreen';
import TaskManagementScreen from '../screens/TaskManagementScreen';
import CreateResponsibleScreen from '../screens/CreateResponsibleScreen';
import LiveChatScreen from '../screens/LiveChatScreen';
import KnowledgeBaseScreen from '../screens/KnowledgeBaseScreen';
import LoadingScreen from '../screens/LoadingScreen';
import ErrorScreen from '../screens/ErrorScreen';
import ManagerDashboardScreen from '../screens/ManagerDashboardScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="GenerateBadge" component={GenerateBadgeScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="FaceRecognition" component={FaceRecognitionScreen} />
      <Stack.Screen name="EmployeeList" component={EmployeeListScreen} />
      <Stack.Screen name="AddEmployee" component={AddEmployeeScreen as React.ComponentType<{}>} />
      <Stack.Screen name="EditEmployee" component={EditEmployeeScreen} initialParams={{ employeeId: '' }} />
      <Stack.Screen name="EmployeePerformance" component={EmployeePerformanceScreen} />
      <Stack.Screen name="EmployeePortal" component={EmployeePortalScreen} />
      <Stack.Screen name="EmployeeHistory" component={EmployeeHistoryScreen} />
      <Stack.Screen name="Absence" component={AbsenceScreen} />
      <Stack.Screen name="AbsenceManagement" component={AbsenceManagementScreen} />
      <Stack.Screen name="LeaveManagement" component={LeaveManagementScreen} />
      <Stack.Screen name="SubmitLeave" component={SubmitLeaveScreen} />
      <Stack.Screen name="Overtime" component={OvertimeScreen} />
      <Stack.Screen name="OvertimeManagement" component={OvertimeManagementScreen} />
      <Stack.Screen name="Payroll" component={PayrollScreen} />
      <Stack.Screen name="GenerateReport" component={GenerateReportScreen} />
      <Stack.Screen name="TeamPerformance" component={TeamPerformanceScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="CompanySettings" component={CompanySettingsScreen} />
      <Stack.Screen name="BenefitsManagement" component={BenefitsManagementScreen} />
      <Stack.Screen name="TaskManagement" component={TaskManagementScreen} />
      <Stack.Screen name="CreateResponsible" component={CreateResponsibleScreen} />
      <Stack.Screen name="LiveChat" component={LiveChatScreen} />
      <Stack.Screen name="KnowledgeBase" component={KnowledgeBaseScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Error" component={ErrorScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="ManagerDashboard" component={ManagerDashboardScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;