import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
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
import { theme } from '../styles/theme';
import { formatFirebaseDate } from '../utils/dateUtils';

type AllowedScreens =
  | 'Dashboard'
  | 'AdminDashboard'
  | 'ManagerDashboard'
  | 'EmployeeList'
  | 'TaskManagement'
  | 'SubmitLeave';

// Composant de carte réutilisable avec animations améliorées
const AnimatedCard: React.FC<{
  children: React.ReactNode;
  translateY: Animated.Value;
  delay?: number;
}> = ({ children, translateY, delay = 0 }) => {
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ translateY }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Composant de résumé avec design amélioré
const SummaryCard: React.FC<{
  tasks: any[];
  leaves: any[];
  employees: any[];
  translateY: Animated.Value;
}> = ({ tasks, leaves, employees, translateY }) => (
  <AnimatedCard translateY={translateY} delay={200}>
    <Text style={styles.cardTitle}>📊 Résumé de l'Équipe</Text>
    <View style={styles.summaryContainer}>
      <View style={styles.summaryItem}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle"
            size={28}
            color={theme.colors.white}
          />
        </View>
        <Text style={styles.summaryValue}>{tasks.length}</Text>
        <Text style={styles.summaryLabel}>Tâches</Text>
      </View>
      <View style={styles.summaryItem}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.accent },
          ]}
        >
          <Ionicons name="calendar" size={28} color={theme.colors.white} />
        </View>
        <Text style={styles.summaryValue}>{leaves.length}</Text>
        <Text style={styles.summaryLabel}>Congés</Text>
      </View>
      <View style={styles.summaryItem}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.primaryLight },
          ]}
        >
          <Ionicons name="people" size={28} color={theme.colors.white} />
        </View>
        <Text style={styles.summaryValue}>{employees.length}</Text>
        <Text style={styles.summaryLabel}>Employés</Text>
      </View>
    </View>
  </AnimatedCard>
);

// Composant de notifications avec design amélioré
const NotificationsCard: React.FC<{
  leaves: any[];
  translateY: Animated.Value;
}> = ({ leaves, translateY }) => (
  <AnimatedCard translateY={translateY} delay={400}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>🔔 Notifications Récentes</Text>
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllButtonText}>Voir tout</Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
    <View style={styles.notificationsContainer}>
      {leaves.slice(0, 5).map((item, index) => (
        <Animated.View
          key={item.id}
          style={[
            styles.notificationItem,
            {
              transform: [
                {
                  translateX: new Animated.Value(-50).interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.notificationIcon}>
            <Ionicons
              name="time-outline"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationName}>
              {item.employeeName || 'Inconnu'}
            </Text>
            <Text style={styles.notificationDate}>
              {formatFirebaseDate(item.startDate)} -{' '}
              {formatFirebaseDate(item.endDate)}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.primary}
          />
        </Animated.View>
      ))}
      {leaves.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off"
            size={48}
            color={theme.colors.border}
          />
          <Text style={styles.emptyText}>Aucune notification</Text>
          <Text style={styles.emptySubText}>Tout est à jour !</Text>
        </View>
      )}
    </View>
  </AnimatedCard>
);

// Composant de liens rapides avec design amélioré
const QuickLinksCard: React.FC<{
  role: string | null;
  handleNavigation: (screen: AllowedScreens) => void;
  translateY: Animated.Value;
}> = ({ role, handleNavigation, translateY }) => (
  <AnimatedCard translateY={translateY} delay={600}>
    <Text style={styles.cardTitle}>⚡ Accès Rapides</Text>
    <View style={styles.linksContainer}>
      {(role === 'admin' || role === 'manager') && (
        <>
          {role === 'admin' && (
            <TouchableOpacity
              style={[
                styles.linkButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => handleNavigation('AdminDashboard')}
              accessibilityLabel="Accéder au tableau de bord administrateur"
            >
              <View style={styles.linkIconContainer}>
                <Ionicons
                  name="analytics"
                  size={24}
                  color={theme.colors.white}
                />
              </View>
              <Text style={styles.linkText}>Tableau Admin</Text>
            </TouchableOpacity>
          )}
          {role === 'manager' && (
            <TouchableOpacity
              style={[
                styles.linkButton,
                { backgroundColor: theme.colors.accent },
              ]}
              onPress={() => handleNavigation('ManagerDashboard')}
              accessibilityLabel="Accéder au tableau de bord manager"
            >
              <View style={styles.linkIconContainer}>
                <Ionicons
                  name="bar-chart"
                  size={24}
                  color={theme.colors.white}
                />
              </View>
              <Text style={styles.linkText}>Tableau Manager</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.linkButton,
              { backgroundColor: theme.colors.primaryLight },
            ]}
            onPress={() => handleNavigation('EmployeeList')}
            accessibilityLabel="Gérer les employés"
          >
            <View style={styles.linkIconContainer}>
              <Ionicons name="people" size={24} color={theme.colors.white} />
            </View>
            <Text style={styles.linkText}>Gérer Employés</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: theme.colors.info }]}
            onPress={() => handleNavigation('TaskManagement')}
            accessibilityLabel="Gérer les tâches"
          >
            <View style={styles.linkIconContainer}>
              <Ionicons name="list" size={24} color={theme.colors.white} />
            </View>
            <Text style={styles.linkText}>Gérer Tâches</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={[styles.linkButton, { backgroundColor: theme.colors.success }]}
        onPress={() => handleNavigation('Dashboard')}
        accessibilityLabel="Accéder au tableau de bord"
      >
        <View style={styles.linkIconContainer}>
          <Ionicons name="grid" size={24} color={theme.colors.white} />
        </View>
        <Text style={styles.linkText}>Tableau de Bord</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.linkButton, { backgroundColor: theme.colors.warning }]}
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
        <View style={styles.linkIconContainer}>
          <Ionicons name="calendar" size={24} color={theme.colors.white} />
        </View>
        <Text style={styles.linkText}>Demander Congé</Text>
      </TouchableOpacity>
    </View>
  </AnimatedCard>
);

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || null;
  const { employees } = useEmployee();
  const { leaves } = useLeave();
  const { tasks } = useTasks();
  const navigation = useNavigation<AuthScreenNavigationProp<'Home'>>();
  const [isLoading, setIsLoading] = useState(true);
  const headerOpacity = React.useRef(new Animated.Value(0)).current;
  const cardTranslateY = React.useRef(new Animated.Value(50)).current;

  // Logs de débogage pour le rôle
  useEffect(() => {
    console.log('🔍 HomeScreen - Utilisateur actuel:', user);
    console.log('🎭 HomeScreen - Rôle détecté:', role);
    console.log('📧 HomeScreen - Email:', user?.email);
  }, [user, role]);

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
      await dispatch(logoutUser()).unwrap();
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
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>👋 Bienvenue, {userName}</Text>
            <Text style={styles.subtitle}>
              Voici un aperçu de vos activités aujourd'hui
            </Text>
            {role && (
              <Text style={styles.roleText}>
                Rôle:{' '}
                {role === 'admin'
                  ? '👑 Administrateur'
                  : role === 'manager'
                  ? '📊 Manager'
                  : '👤 Employé'}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            accessibilityLabel="Se déconnecter"
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color={theme.colors.error}
            />
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
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 40,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.medium,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textDark,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  roleText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundLight,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  seeAllButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: theme.spacing.xs,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: '33%',
    ...theme.shadows.small,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginTop: theme.spacing.xs,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textDark,
  },
  notificationDate: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  linkButton: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: '48%',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  linkIconContainer: {
    marginRight: theme.spacing.sm,
  },
  linkText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  notificationsContainer: {
    marginTop: theme.spacing.md,
  },
});

export default HomeScreen;
