import React, { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import useEmployee from '@hooks/useEmployee';
import useLeave from '@hooks/useLeave';
import useTasks from '@hooks/useTasks';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp, AuthStackParamList } from '../navigation/types';
import { Leave } from '../types/index';
import Toast from 'react-native-toast-message';

// Définir les écrans accessibles depuis HomeScreen
type AllowedScreens = 'Dashboard' | 'AdminDashboard' | 'ManagerDashboard' | 'EmployeeList' | 'TaskManagement' | 'SubmitLeave';

const HomeScreen = () => {
  const { user, role } = useAuth();
  const { employees } = useEmployee();
  const { leaves } = useLeave();
  const { tasks } = useTasks();
  const navigation = useNavigation<AuthScreenNavigationProp<'Home'>>();
  const [isLoading, setIsLoading] = useState(true);
  const headerOpacity = React.useRef(new Animated.Value(0)).current;
  const cardTranslateY = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(cardTranslateY, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
    setIsLoading(false);
  }, []);

  const userName = user?.email?.split('@')[0] || 'Utilisateur';

  if (isLoading) {
    return <ActivityIndicator size="large" color="#4A90E2" style={styles.loading} />;
  }

  const renderNotificationItem = ({ item }: { item: Leave }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.employeeName || 'Inconnu'}</Text>
      <Text style={styles.notificationDate}>{item.startDate} - {item.endDate}</Text>
    </View>
  );

  const handleNavigation = (screen: AllowedScreens) => {
    if (
      (screen === 'AdminDashboard' && role !== 'admin') ||
      (screen === 'ManagerDashboard' && role !== 'manager') ||
      (screen === 'EmployeeList' && role !== 'admin' && role !== 'manager') ||
      (screen === 'TaskManagement' && role !== 'admin' && role !== 'manager')
    ) {
      Toast.show({ type: 'error', text1: 'Accès refusé', text2: "Vous n'avez pas les autorisations nécessaires." });
      return;
    }
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.title}>Bienvenue, {userName}</Text>
        <Text style={styles.subtitle}>Voici un aperçu de vos activités</Text>
      </Animated.View>

      <Animated.View style={[styles.card, { transform: [{ translateY: cardTranslateY }] }]}>
        <Text style={styles.cardTitle}>Résumé</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tâches</Text>
            <Text style={styles.summaryValue}>{tasks.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Congés</Text>
            <Text style={styles.summaryValue}>{leaves.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Employés</Text>
            <Text style={styles.summaryValue}>{employees.length}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.card, { transform: [{ translateY: cardTranslateY }] }]}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <FlatList
          data={leaves.slice(0, 5)}
          keyExtractor={item => item.id}
          renderItem={renderNotificationItem}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune notification</Text>}
        />
      </Animated.View>

      <Animated.View style={[styles.card, { transform: [{ translateY: cardTranslateY }] }]}>
        <Text style={styles.cardTitle}>Liens Rapides</Text>
        <View style={styles.linksContainer}>
          {(role === 'admin' || role === 'manager') && (
            <>
              {role === 'admin' && (
                <TouchableOpacity style={styles.linkButton} onPress={() => handleNavigation('AdminDashboard')}>
                  <Text style={styles.linkText}>Tableau Admin</Text>
                </TouchableOpacity>
              )}
              {role === 'manager' && (
                <TouchableOpacity style={styles.linkButton} onPress={() => handleNavigation('ManagerDashboard')}>
                  <Text style={styles.linkText}>Tableau Manager</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.linkButton} onPress={() => handleNavigation('EmployeeList')}>
                <Text style={styles.linkText}>Gérer Employés</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkButton} onPress={() => handleNavigation('TaskManagement')}>
                <Text style={styles.linkText}>Gérer Tâches</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.linkButton} onPress={() => handleNavigation('Dashboard')}>
            <Text style={styles.linkText}>Tableau de Bord</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              handleNavigation('SubmitLeave');
              Toast.show({ type: 'info', text1: 'Action', text2: 'Demande de congé ouverte.' });
            }}
          >
            <Text style={styles.linkText}>Demander Congé</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FA',
    padding: 20,
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  summaryItem: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    width: '30%',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 5,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  notificationText: {
    fontSize: 15,
    color: '#34495E',
    fontWeight: '500',
  },
  notificationDate: {
    fontSize: 13,
    color: '#95A5A6',
  },
  emptyText: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
    paddingVertical: 15,
  },
  linksContainer: {
    flexDirection: 'column',
  },
  linkButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  linkText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F4F7FA',
  },
});

export default HomeScreen;