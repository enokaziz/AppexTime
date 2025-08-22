import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import useEmployee from '@hooks/useEmployee';
import useLeave from '@hooks/useLeave';
import useTasks from '@hooks/useTasks';
import usePerformance from '@hooks/usePerformance';
import {
  logNotification,
  onLeaveStatusChange,
} from '@utils/notificationHelper';
import { Employee, Leave, Task, TaskStatus } from '../../types/index';
import { useAppSelector } from '../../store/hooks';

const ManagerDashboardScreen: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;
  const {
    employees,
    handleAddEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,
  } = useEmployee();
  const { leaves, approveLeave, rejectLeave } = useLeave();
  const { tasks, assignTask, completeTask } = useTasks();
  const { evaluatePerformance } = usePerformance();

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (role !== 'manager' && role !== 'admin') {
      Alert.alert(
        'Accès refusé',
        "Vous n'avez pas les autorisations nécessaires pour accéder à ce tableau de bord.",
      );
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }

    const unsubscribe = onLeaveStatusChange((status: string) => {
      Alert.alert('Notification', `Le congé a été ${status}.`);
    });

    return () => unsubscribe();
  }, [role]);

  const handleApproveLeave = (id: string) => {
    if (!user || !role) {
      Alert.alert(
        'Erreur',
        'Vous devez être connecté pour approuver un congé.',
      );
      return;
    }
    approveLeave(id);
  };

  const handleRejectLeave = (id: string) => {
    if (!user || !role) {
      Alert.alert('Erreur', 'Vous devez être connecté pour refuser un congé.');
      return;
    }
    rejectLeave(id);
  };

  const handleAssignTask = (
    title: string,
    description: string,
    employeeId: string,
    employeeName: string,
    status: TaskStatus,
  ) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      employeeName,
      employeeId,
      assignedTo: employeeName,
      status,
      completed: false,
      dueDate: new Date().toISOString(),
    };
    assignTask(newTask);
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manager Dashboard</Text>
      {/* Reste du code... */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  // Autres styles...
});

export default ManagerDashboardScreen;
