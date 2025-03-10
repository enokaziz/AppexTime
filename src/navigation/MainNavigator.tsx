import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ManagerDashboardScreen from '../screens/ManagerDashboardScreen';
import EmployeeListScreen from '../screens/employee/EmployeeListScreen';
import TaskManagementScreen from '../screens/TaskManagementScreen';
import SubmitLeaveScreen from '../screens/SubmitLeaveScreen';

const Stack = createStackNavigator();

export function MainNavigator() {
  const { role, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      {role === 'admin' && (
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      )}
      {role === 'manager' && (
        <Stack.Screen name="ManagerDashboard" component={ManagerDashboardScreen} />
      )}
      {(role === 'admin' || role === 'manager') && (
        <>
          <Stack.Screen name="EmployeeList" component={EmployeeListScreen} />
          <Stack.Screen name="TaskManagement" component={TaskManagementScreen} />
        </>
      )}
      <Stack.Screen name="SubmitLeave" component={SubmitLeaveScreen} />
    </Stack.Navigator>
  );
}