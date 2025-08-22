import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AdminDashboardScreen from '../screens/dashboard/AdminDashboardScreen';
import ManagerDashboardScreen from '../screens/dashboard/ManagerDashboardScreen';
import EmployeeListScreen from '../screens/employee/EmployeeListScreen';
import TaskManagementScreen from '../screens/support/TaskManagementScreen';
import SubmitLeaveScreen from '../screens/leave-management/SubmitLeaveScreen';

const Stack = createStackNavigator();

export function MainNavigator() {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      {role === 'admin' && (
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      )}
      {role === 'manager' && (
        <Stack.Screen
          name="ManagerDashboard"
          component={ManagerDashboardScreen}
        />
      )}
      {(role === 'admin' || role === 'manager') && (
        <>
          <Stack.Screen name="EmployeeList" component={EmployeeListScreen} />
          <Stack.Screen
            name="TaskManagement"
            component={TaskManagementScreen}
          />
        </>
      )}
      <Stack.Screen name="SubmitLeave" component={SubmitLeaveScreen} />
    </Stack.Navigator>
  );
}
