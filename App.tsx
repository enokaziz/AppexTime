import React, { createRef, lazy, Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { useAppSelector } from './src/store/hooks';
import { LeaveProvider } from './src/contexts/LeaveContext';
import { TaskProvider } from './src/contexts/TaskContext';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { ParamListBase } from '@react-navigation/native';
import './src/config/firebase';
import { usePreloader } from './src/services/preloader';
import * as cacheService from './src/services/cache';

// Lazy loading des navigateurs
const AppNavigator = lazy(() => import('./src/navigation/AppNavigator'));
const AuthNavigator = lazy(() => import('./src/navigation/AuthNavigator'));

export const navigationRef = createRef<NavigationContainerRef<ParamListBase>>();

const Navigation = () => {
  const { isLoading, user } = useAppSelector((state) => state.auth);
  // Appel conditionnel du hook mais avec des valeurs par défaut pour maintenir l'ordre
  usePreloader(user?.id || '', user?.role || '');

  // Effet pour initialiser le cache
  useEffect(() => {
    cacheService.initCache();
    return () => {
      cacheService.stopCache();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Chargement de l'application...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Suspense
        fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Chargement de l'interface...</Text>
          </View>
        }
      >
        {user ? <AppNavigator /> : <AuthNavigator />}
      </Suspense>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <LeaveProvider>
        <TaskProvider>
          <Navigation />
          <Toast />
        </TaskProvider>
      </LeaveProvider>
    </Provider>
  );
}

// Styles pour les écrans de chargement
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
