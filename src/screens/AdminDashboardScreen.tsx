import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateLeaveStatus, fetchLeaves } from '../store/slices/leaveSlice';
import {
  updateTaskStatus,
  fetchTasks,
  addTask,
} from '../store/slices/taskSlice';
import {
  deleteEmployee,
  fetchEmployees,
  addEmployee,
} from '../store/slices/employeeSlice';
import { logoutUser } from '../store/slices/authSlice';
import { Leave, Task, LeaveStatus, TaskStatus } from '../types';
import { Employee, PhotoData } from '../types/employee';
import { colors } from '../styles/globalStylesUpdated';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/native';
import { UserRole, Permissions } from '../types/Permissions';
import { RootState } from '../store';

interface SectionProps<T> {
  title: string;
  data: T[];
  renderContent: () => JSX.Element;
  actionText?: string;
  onAction?: () => void;
}

const Section = <T extends unknown>({
  title,
  data,
  renderContent,
  actionText,
  onAction,
}: SectionProps<T>) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.section, { opacity }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {actionText && onAction && (
          <TouchableOpacity style={styles.actionButton} onPress={onAction}>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={colors.white}
            />
            <Text style={styles.buttonText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="information-circle-outline"
            size={40}
            color={colors.border}
          />
          <Text style={styles.emptyText}>Aucune donnée</Text>
        </View>
      ) : (
        renderContent()
      )}
    </Animated.View>
  );
};

const AdminDashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state: RootState) => state.employee);
  const { leaves } = useAppSelector((state: RootState) => state.leave);
  const { tasks } = useAppSelector((state: RootState) => state.task);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const navigationRef =
    React.useRef<NavigationContainerRef<ParamListBase>>(null);

  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Charger les données paginées
    dispatch(fetchLeaves({ page: currentPage, pageSize }));
    dispatch(fetchTasks({ page: currentPage, pageSize }));
    dispatch(fetchEmployees({ page: currentPage, pageSize }));
  }, [currentPage, pageSize]);

  const handleLeaveStatusUpdate = async (
    leaveId: string,
    status: LeaveStatus,
    employeeId: string,
  ) => {
    try {
      const payload = { leaveId, status, employeeId };
      await dispatch(updateLeaveStatus(payload)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: `Congé ${status === 'approved' ? 'approuvé' : 'refusé'}`,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Échec de la mise à jour du statut',
      });
    }
  };

  const handleTaskStatusUpdate = async (
    taskId: string,
    status: TaskStatus,
    employeeId: string,
  ) => {
    try {
      const payload = { taskId, status, employeeId };
      await dispatch(updateTaskStatus(payload)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Statut de la tâche mis à jour',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Échec de la mise à jour du statut',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Réinitialiser la page à 1
  };

  // Récupérer les employés gérés pour les managers
  const managedEmployees =
    user?.role === 'manager' ? user.managedEmployees || [] : [];

  const confirmDeleteEmployee = (id: string) => {
    if (!user || user.role !== 'admin') {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Permission refusée',
      });
      return;
    }
    Toast.show({
      type: 'info',
      text1: 'Confirmation',
      text2: 'Voulez-vous supprimer cet employé ?',
      onPress: async () => {
        try {
          await dispatch(deleteEmployee(id)).unwrap();
          Toast.show({
            type: 'success',
            text1: 'Succès',
            text2: 'Employé supprimé',
          });
        } catch (error: any) {
          Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: 'Échec de la suppression',
          });
        }
      },
    });
  };

  useEffect(() => {
    const fetchEmployeesAsync = async () => {
      try {
        const employees = await dispatch(
          fetchEmployees({ page: currentPage, pageSize })
        ).unwrap();
        console.log(employees);
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchEmployeesAsync();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const addEmployeeHandler = () => {
    // Créer un objet avec la structure correcte pour addEmployee
    const employeeData = {
      firstName: 'Nouveau',
      lastName: 'Employé',
      name: 'Nouveau Employé',
      email: `employe-${Date.now()}@company.com`,
      phone: '',
      employeeId: `EMP-${Date.now()}`,
      companyId: 'company-123',
    };

    const photoData: PhotoData = {
      uri: 'https://via.placeholder.com/150',
      type: 'image/jpeg',
      name: 'default-avatar.jpg',
    };

    dispatch(addEmployee({ employeeData, photoData }));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      // Utilisation de navigationRef global plutôt que local
      if (navigationRef.current) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
      Toast.show({
        type: 'success',
        text1: 'Déconnexion réussie',
        text2: 'À bientôt!',
      });
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de se déconnecter: ' + (error as Error).message,
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Dashboard Admin
      </Animated.Text>

      <Section<Employee>
        title="Employés"
        data={employees}
        renderContent={() => (
          <View>
            {employees.map((employee) => (
              <View key={employee.id} style={styles.item}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemText}>{employee.name}</Text>
                  <Text style={styles.itemSubText}>{employee.email}</Text>
                </View>
                {user?.role === 'admin' && (
                  <TouchableOpacity
                    style={[
                      styles.actionButtonSmall,
                      { backgroundColor: colors.error },
                    ]}
                    onPress={() => confirmDeleteEmployee(employee.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageSizeChange(10)}
              >
                <Text style={styles.paginationText}>10 par page</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageSizeChange(25)}
              >
                <Text style={styles.paginationText}>25 par page</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageSizeChange(50)}
              >
                <Text style={styles.paginationText}>50 par page</Text>
              </TouchableOpacity>
              <View style={styles.pageControls}>
                <TouchableOpacity
                  style={[styles.paginationButton, styles.pageControl]}
                  onPress={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.paginationText}>Précédent</Text>
                </TouchableOpacity>
                <Text style={styles.pageInfo}>Page {currentPage}</Text>
                <TouchableOpacity
                  style={[styles.paginationButton, styles.pageControl]}
                  onPress={() => handlePageChange(currentPage + 1)}
                  disabled={false} // À ajuster selon le total de pages
                >
                  <Text style={styles.paginationText}>Suivant</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        actionText="Ajouter"
        onAction={addEmployeeHandler}
      />

      <Section<Leave>
        title="Congés"
        data={leaves}
        renderContent={() => (
          <View>
            {leaves.map((leave) => (
              <View key={leave.id} style={styles.item}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemText}>{leave.reason}</Text>
                  <Text style={styles.itemSubText}>
                    {`Employé: ${leave.employeeName || 'Non assigné'}`}
                  </Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.actionButtonSmall,
                      {
                        backgroundColor:
                          leave.status === 'approved'
                            ? colors.success
                            : colors.error,
                      },
                    ]}
                    onPress={() =>
                      handleLeaveStatusUpdate(
                        leave.id,
                        leave.status === 'approved' ? 'rejected' : 'approved',
                        leave.employeeId,
                      )
                    }
                  >
                    <Ionicons
                      name={
                        leave.status === 'approved'
                          ? 'close-outline'
                          : 'checkmark-outline'
                      }
                      size={20}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageSizeChange(10)}
              >
                <Text style={styles.paginationText}>10 par page</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageSizeChange(25)}
              >
                <Text style={styles.paginationText}>25 par page</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageSizeChange(50)}
              >
                <Text style={styles.paginationText}>50 par page</Text>
              </TouchableOpacity>
              <View style={styles.pageControls}>
                <TouchableOpacity
                  style={[styles.paginationButton, styles.pageControl]}
                  onPress={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.paginationText}>Précédent</Text>
                </TouchableOpacity>
                <Text style={styles.pageInfo}>Page {currentPage}</Text>
                <TouchableOpacity
                  style={[styles.paginationButton, styles.pageControl]}
                  onPress={() => handlePageChange(currentPage + 1)}
                  disabled={false} // À ajuster selon le total de pages
                >
                  <Text style={styles.paginationText}>Suivant</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <Section<Task>
        title="Tâches"
        data={tasks}
        renderContent={() => (
          <View>
            {tasks.map((task) => (
              <View key={task.id} style={styles.item}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemText}>{task.title}</Text>
                  <Text style={styles.itemSubText}>
                    {`Assigné à: ${task.employeeName || 'Non assigné'}`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.actionButtonSmall,
                    { backgroundColor: colors.success },
                  ]}
                  onPress={() =>
                    handleTaskStatusUpdate(
                      task.id,
                      'completed',
                      task.employeeId,
                    )
                  }
                >
                  <Ionicons
                    name="checkmark-outline"
                    size={20}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageSizeChange(10)}
              >
                <Text style={styles.paginationText}>10 par page</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageSizeChange(25)}
              >
                <Text style={styles.paginationText}>25 par page</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePageSizeChange(50)}
              >
                <Text style={styles.paginationText}>50 par page</Text>
              </TouchableOpacity>
              <View style={styles.pageControls}>
                <TouchableOpacity
                  style={[styles.paginationButton, styles.pageControl]}
                  onPress={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.paginationText}>Précédent</Text>
                </TouchableOpacity>
                <Text style={styles.pageInfo}>Page {currentPage}</Text>
                <TouchableOpacity
                  style={[styles.paginationButton, styles.pageControl]}
                  onPress={() => handlePageChange(currentPage + 1)}
                  disabled={false} // À ajuster selon le total de pages
                >
                  <Text style={styles.paginationText}>Suivant</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        actionText="Ajouter"
        onAction={() =>
          dispatch(
            addTask({
              id: `task-${Date.now()}`,
              title: 'Nouvelle tâche',
              description: 'Description de la tâche',
              assignedTo: '',
              employeeName: 'Non assigné',
              employeeId: '',
              status: 'pending',
              dueDate: new Date().toISOString().split('T')[0],
            }),
          )
        }
      />

      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.error, marginTop: 20 },
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.white} />
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: colors.text,
    paddingHorizontal: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  itemSubText: {
    fontSize: 14,
    color: colors.textLight,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonSmall: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  paginationButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  paginationText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  pageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pageControl: {
    flex: 1,
  },
  pageInfo: {
    color: colors.text,
    fontSize: 14,
  },
});

export default AdminDashboardScreen;
