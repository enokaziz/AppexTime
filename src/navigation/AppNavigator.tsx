import React, { lazy, Suspense } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import LoadingScreen from '../screens/LoadingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CacheProvider } from '../providers/CacheProvider';

// Lazy loaded screens
const HomeScreen = lazy(() => import('../screens/HomeScreen'));
const LoginScreen = lazy(() => import('../screens/Auth/LoginScreen'));
const SignupScreen = lazy(() => import('../screens/Auth/SignupScreen'));
const ForgotPasswordScreen = lazy(
  () => import('../screens/Auth/ForgotPasswordScreen'),
);
const AttendanceScreen = lazy(
  () => import('../screens/time-management/AttendanceScreen'),
);
const GenerateBadgeScreen = lazy(
  () => import('../screens/GenerateBadgeScreen'),
);
const QRScannerScreen = lazy(
  () => import('../screens/support/QRScannerScreen'),
);
const FaceRecognitionScreen = lazy(
  () => import('../screens/support/FaceRecognitionScreen'),
);
const EmployeeListScreen = lazy(
  () => import('../screens/employee/EmployeeListScreen'),
);
const AddEmployeeScreen = lazy(
  () => import('../screens/employee/AddEmployeeScreen'),
);
const EditEmployeeScreen = lazy(
  () => import('../screens/employee/EditEmployeeScreen'),
);
const EmployeePerformanceScreen = lazy(
  () => import('../screens/employee/EmployeePerformanceScreen'),
);
const EmployeePortalScreen = lazy(
  () => import('../screens/employee/EmployeePortalScreen'),
);
const EmployeeHistoryScreen = lazy(
  () => import('../screens/employee/EmployeeHistoryScreen'),
);
const AbsenceScreen = lazy(
  () => import('../screens/leave-management/AbsenceScreen'),
);
const AbsenceManagementScreen = lazy(
  () => import('../screens/leave-management/AbsenceManagementScreen'),
);
const LeaveManagementScreen = lazy(
  () => import('../screens/leave-management/LeaveManagementScreen'),
);
const SubmitLeaveScreen = lazy(
  () => import('../screens/leave-management/SubmitLeaveScreen'),
);
const OvertimeScreen = lazy(
  () => import('../screens/time-management/OvertimeScreen'),
);
const OvertimeManagementScreen = lazy(
  () => import('../screens/time-management/OvertimeManagementScreen'),
);
const PayrollScreen = lazy(() => import('../screens/support/PayrollScreen'));
const GenerateReportScreen = lazy(
  () => import('../screens/GenerateReportScreen'),
);
const TeamPerformanceScreen = lazy(
  () => import('../screens/TeamPerformanceScreen'),
);
const SupportScreen = lazy(() => import('../screens/SupportScreen'));
const CompanySettingsScreen = lazy(
  () => import('../screens/CompanySettingsScreen'),
);
const BenefitsManagementScreen = lazy(
  () => import('../screens/BenefitsManagementScreen'),
);
const TaskManagementScreen = lazy(
  () => import('../screens/support/TaskManagementScreen'),
);
const CreateResponsibleScreen = lazy(
  () => import('../screens/CreateResponsibleScreen'),
);
const LiveChatScreen = lazy(() => import('../screens/support/LiveChatScreen'));
const KnowledgeBaseScreen = lazy(
  () => import('../screens/support/KnowledgeBaseScreen'),
);
const ErrorScreen = lazy(() => import('../screens/ErrorScreen'));
const ManagerDashboardScreen = lazy(
  () => import('../screens/dashboard/ManagerDashboardScreen'),
);
const DashboardScreen = lazy(
  () => import('../screens/dashboard/DashboardScreen'),
);
const AdminDashboardScreen = lazy(
  () => import('../screens/dashboard/AdminDashboardScreen'),
);

const Stack = createStackNavigator<AuthStackParamList>();

// Wrapper pour les composants lazy-loaded
const LazyComponent = (Component: React.LazyExoticComponent<any>): React.FC => {
  return (props) => (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

// Composant de chargement pour les écrans en cours de chargement
const LoadingScreenComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

// Wrapper pour gérer le chargement paresseux
const LazyScreen = <T extends keyof AuthStackParamList>({
  component: Component,
  ...props
}: {
  component: React.ComponentType<StackScreenProps<AuthStackParamList, T>>;
} & StackScreenProps<AuthStackParamList, T>) => (
  <React.Suspense fallback={<LoadingScreenComponent />}>
    <Component {...props} />
  </React.Suspense>
);

const AppNavigator = () => {
  return (
    <CacheProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Home" component={LazyComponent(HomeScreen)} />
          <Stack.Screen
            name="Login"
            component={(
              props: StackScreenProps<AuthStackParamList, 'Login'>,
            ) => <LazyScreen component={LoginScreen} {...props} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={(
              props: StackScreenProps<AuthStackParamList, 'Signup'>,
            ) => <LazyScreen component={SignupScreen} {...props} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={(
              props: StackScreenProps<AuthStackParamList, 'ForgotPassword'>,
            ) => <LazyScreen component={ForgotPasswordScreen} {...props} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Attendance"
            component={(
              props: StackScreenProps<AuthStackParamList, 'Attendance'>,
            ) => <LazyScreen component={AttendanceScreen} {...props} />}
          />
          <Stack.Screen
            name="GenerateBadge"
            component={LazyComponent(GenerateBadgeScreen)}
          />
          <Stack.Screen
            name="QRScanner"
            component={(
              props: StackScreenProps<AuthStackParamList, 'QRScanner'>,
            ) => <LazyScreen component={QRScannerScreen} {...props} />}
          />
          <Stack.Screen
            name="FaceRecognition"
            component={(
              props: StackScreenProps<AuthStackParamList, 'FaceRecognition'>,
            ) => <LazyScreen component={FaceRecognitionScreen} {...props} />}
          />
          <Stack.Screen
            name="EmployeeList"
            component={(
              props: StackScreenProps<AuthStackParamList, 'EmployeeList'>,
            ) => <LazyScreen component={EmployeeListScreen} {...props} />}
          />
          <Stack.Screen
            name="AddEmployee"
            component={(
              props: StackScreenProps<AuthStackParamList, 'AddEmployee'>,
            ) => <LazyScreen component={AddEmployeeScreen} {...props} />}
          />
          <Stack.Screen
            name="EditEmployee"
            component={(
              props: StackScreenProps<AuthStackParamList, 'EditEmployee'>,
            ) => <LazyScreen component={EditEmployeeScreen} {...props} />}
          />
          <Stack.Screen
            name="EmployeePerformance"
            component={LazyComponent(EmployeePerformanceScreen)}
          />
          <Stack.Screen
            name="EmployeePortal"
            component={LazyComponent(EmployeePortalScreen)}
          />
          <Stack.Screen
            name="EmployeeHistory"
            component={LazyComponent(EmployeeHistoryScreen)}
          />
          <Stack.Screen
            name="Absence"
            component={LazyComponent(AbsenceScreen)}
          />
          <Stack.Screen
            name="AbsenceManagement"
            component={LazyComponent(AbsenceManagementScreen)}
          />
          <Stack.Screen
            name="LeaveManagement"
            component={LazyComponent(LeaveManagementScreen)}
          />
          <Stack.Screen
            name="SubmitLeave"
            component={LazyComponent(SubmitLeaveScreen)}
          />
          <Stack.Screen
            name="Overtime"
            component={LazyComponent(OvertimeScreen)}
          />
          <Stack.Screen
            name="OvertimeManagement"
            component={LazyComponent(OvertimeManagementScreen)}
          />
          <Stack.Screen
            name="Payroll"
            component={LazyComponent(PayrollScreen)}
          />
          <Stack.Screen
            name="GenerateReport"
            component={LazyComponent(GenerateReportScreen)}
          />
          <Stack.Screen
            name="TeamPerformance"
            component={LazyComponent(TeamPerformanceScreen)}
          />
          <Stack.Screen
            name="Support"
            component={LazyComponent(SupportScreen)}
          />
          <Stack.Screen
            name="CompanySettings"
            component={LazyComponent(CompanySettingsScreen)}
          />
          <Stack.Screen
            name="BenefitsManagement"
            component={LazyComponent(BenefitsManagementScreen)}
          />
          <Stack.Screen
            name="TaskManagement"
            component={LazyComponent(TaskManagementScreen)}
          />
          <Stack.Screen
            name="CreateResponsible"
            component={LazyComponent(CreateResponsibleScreen)}
          />
          <Stack.Screen
            name="LiveChat"
            component={LazyComponent(LiveChatScreen)}
          />
          <Stack.Screen
            name="KnowledgeBase"
            component={LazyComponent(KnowledgeBaseScreen)}
          />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Error" component={LazyComponent(ErrorScreen)} />
          <Stack.Screen
            name="AdminDashboard"
            component={(
              props: StackScreenProps<AuthStackParamList, 'AdminDashboard'>,
            ) => <LazyScreen component={AdminDashboardScreen} {...props} />}
          />
          <Stack.Screen
            name="ManagerDashboard"
            component={(
              props: StackScreenProps<AuthStackParamList, 'ManagerDashboard'>,
            ) => <LazyScreen component={ManagerDashboardScreen} {...props} />}
          />
          <Stack.Screen
            name="Dashboard"
            component={(
              props: StackScreenProps<AuthStackParamList, 'Dashboard'>,
            ) => <LazyScreen component={DashboardScreen} {...props} />}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CacheProvider>
  );
};

export default AppNavigator;
