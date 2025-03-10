// app.tsx
import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { useAuth } from './src/contexts/AuthContext';
import { LeaveProvider } from './src/contexts/LeaveContext';
import { TaskProvider } from './src/contexts/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator'; 
import { View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message'; 
import { NavigationContainer } from '@react-navigation/native';
import './src/config/firebase';

function Navigation() {
  const { isLoading, user } = useAuth(); 

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LeaveProvider>
        <TaskProvider>
          <Navigation />
          <Toast /> 
        </TaskProvider>
      </LeaveProvider>
    </AuthProvider>
  );
}