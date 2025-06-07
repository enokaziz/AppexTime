import React, { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useEmployee from '@hooks/useEmployee';
import useLeave from '@hooks/useLeave';
import useTasks from '@hooks/useTasks';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from '../navigation/types';
import Toast from 'react-native-toast-message';
import { colors } from '../styles/globalStylesUpdated';

type AllowedScreens =
  | 'Dashboard'
  | 'AdminDashboard'
  | 'ManagerDashboard'
  | 'EmployeeList'
  | 'TaskManagement'
  | 'SubmitLeave';

// Composant de carte réutilisable
const AnimatedCard: React.FC<{
  children: React.ReactNode;
  translateY: Animated.Value;
}> = ({ children, translateY }) => (
  <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
    {children}
  </Animated.View>
);

// Composant de résumé
const SummaryCard: React.FC<{
  tasks: any[];
  leaves: any[];
  employees: any[];
  translateY: Animated.Value;
}> = ({ tasks, leaves, employees, translateY }) => (
  <AnimatedCard translateY={translateY}>
    <Text style={styles.cardTitle}>Résumé</Text>
    <View style={styles.summaryContainer}>
      <View style={styles.summaryItem}>
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        <Text style={styles.summaryValue}>{tasks.length}</Text>
        <Text style={styles.summaryLabel}>Tâches</Text>
      </View>
      <View style={styles.summaryItem}>
        <Ionicons name="calendar" size={24} color={colors.primary} />
        <Text style={styles.summaryValue}>{leaves.length}</Text>
        <Text style={styles.summaryLabel}>Congés</Text>
      </View>
      <View style={styles.summaryItem}>
        <Ionicons name="people" size={24} color={colors.primary} />
        <Text style={styles.summaryValue}>{employees.length}</Text>
        <Text style={styles.summaryLabel}>Employés</Text>
      </View>
    </View>
  </AnimatedCard>
);

// Composant de notifications
const NotificationsCard: React.FC<{
  leaves: any[];
  translateY: Animated.Value;
}> = ({ leaves, translateY }) => (
  <AnimatedCard translateY={translateY}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>Notifications</Text>
      <TouchableOpacity>
        <Text style={styles.seeAllButton}>Voir tout</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.notificationsContainer}>
      {leaves.slice(0, 5).map((item) => (
        <View key={item.id} style={styles.notificationItem}>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationName}>
              {item.employeeName || 'Inconnu'}
            </Text>
            <Text style={styles.notificationDate}>
              {item.startDate} - {item.endDate}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </View>
      ))}
      {leaves.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={40} color={colors.border} />
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      )}
    </View>
  </AnimatedCard>
);

// Composant de liens rapides
const QuickLinksCard: React.FC<{
  role: string | null;
  handleNavigation: (screen: AllowedScreens) => void;
  translateY: Animated.Value;
}> = ({ role, handleNavigation, translateY }) => (
  <AnimatedCard translateY={translateY}>
    <Text style={styles.cardTitle}>Liens Rapides</Text>
    <View style={styles.linksContainer}>
      {(role === 'admin' || role === 'manager') && (
        <>
          {role === 'admin' && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleNavigation('AdminDashboard')}
              accessibilityLabel="Accéder au tableau de bord administrateur"
            >
              <Ionicons name="analytics" size={24} color={colors.white} />
              <Text style={styles.linkText}>Tableau Admin</Text>
            </TouchableOpacity>
          )}
          {role === 'manager' && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleNavigation('ManagerDashboard')}
              accessibilityLabel="Accéder au tableau de bord manager"
            >
              <Ionicons name="bar-chart" size={24} color={colors.white} />
              <Text style={styles.linkText}>Tableau Manager</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => handleNavigation('EmployeeList')}
            accessibilityLabel="Gérer les employés"
          >
            <Ionicons name="people" size={24} color={colors.white} />
            <Text style={styles.linkText}>Gérer Employés</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => handleNavigation('TaskManagement')}
            accessibilityLabel="Gérer les tâches"
          >
            <Ionicons name="list" size={24} color={colors.white} />
            <Text style={styles.linkText}>Gérer Tâches</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => handleNavigation('Dashboard')}
        accessibilityLabel="Accéder au tableau de bord"
      >
        <Ionicons name="grid" size={24} color={colors.white} />
        <Text style={styles.linkText}>Tableau de Bord</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => {
          handleNavigation('SubmitLeave');
          Toast.show({
            type: 'info',
            text1: 'Action',
            text2: 'Demande de congé ouverte.',
          });
        }}
        accessibilityLabel="Demander un congé"
      >
        <Ionicons name="calendar" size={24} color={colors.white} />
        <Text style={styles.linkText}>Demander Congé</Text>
      </TouchableOpacity>
    </View>
  </AnimatedCard>
);

const HomeScreen = () => {
  const { user, role, logout } = useAuth();
  const { employees } = useEmployee();
  const { leaves } = useLeave();
  const { tasks } = useTasks();
  const navigation = useNavigation<AuthScreenNavigationProp<'Home'>>();
  const [isLoading, setIsLoading] = useState(true);
  const headerOpacity = React.useRef(new Animated.Value(0)).current;
  const cardTranslateY = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    setIsLoading(false);

    return () => {
      animation.stop();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Déconnexion réussie',
        text2: 'À bientôt!',
      });
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: `Impossible de se déconnecter: ${error.message}`,
      });
    }
  };

  const handleNavigation = (screen: AllowedScreens) => {
    if (
      (screen === 'AdminDashboard' && role !== 'admin') ||
      (screen === 'ManagerDashboard' && role !== 'manager') ||
      (screen === 'EmployeeList' && role !== 'admin' && role !== 'manager') ||
      (screen === 'TaskManagement' && role !== 'admin' && role !== 'manager')
    ) {
      Toast.show({
        type: 'error',
        text1: 'Accès refusé',
        text2: "Vous n'avez pas les autorisations nécessaires.",
      });
      return;
    }
    navigation.navigate(screen);
  };

  const userName = user?.email?.split('@')[0] || 'Utilisateur';

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Bienvenue, {userName}</Text>
            <Text style={styles.subtitle}>
              Voici un aperçu de vos activités
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            accessibilityLabel="Se déconnecter"
          >
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SummaryCard
          tasks={tasks}
          leaves={leaves}
          employees={employees}
          translateY={cardTranslateY}
        />
        <NotificationsCard leaves={leaves} translateY={cardTranslateY} />
        <QuickLinksCard
          role={role}
          handleNavigation={handleNavigation}
          translateY={cardTranslateY}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 5,
  },
  logoutButton: {
    padding: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 10,
    margin: 10,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  seeAllButton: {
    color: colors.primary,
    fontSize: 14,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryItem: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    width: '30%',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text,
    marginTop: 5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  notificationContent: {
    flex: 1,
  },
  notificationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textDark,
  },
  notificationDate: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 10,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  linkButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  notificationsContainer: {
    marginTop: 10,
  },
});

export default HomeScreen;
