import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { updateTaskStatus } from '../store/slices/taskSlice';
import { updateLeaveStatus } from '../store/slices/leaveSlice';
import { Employee, Leave, Task } from '../types';
import { colors } from '../styles/globalStylesUpdated';
import { useToast } from '../hooks/useToast';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { Ionicons } from '@expo/vector-icons';

interface SectionProps {
  title: string;
  data: any[];
  renderContent: (data: any[]) => JSX.Element;
  actionText?: string;
  onAction?: () => void;
}

const Section = React.memo(({ 
  title, 
  data, 
  renderContent, 
  actionText, 
  onAction 
}: SectionProps) => {
  const opacity = useAnimatedValue(0);

  return (
    <Animated.View style={[styles.section, { opacity }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {actionText && onAction && (
          <TouchableOpacity style={styles.actionButton} onPress={onAction}>
            <Ionicons name="add-circle-outline" size={24} color={colors.white} />
            <Text style={styles.buttonText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="information-circle-outline" size={40} color={colors.border} />
          <Text style={styles.emptyText}>Aucune donnée</Text>
        </View>
      ) : (
        renderContent(data)
      )}
    </Animated.View>
  );
});

const ITEMS_PER_PAGE = 5;

const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector(state => state.auth);
  const { tasks } = useAppSelector(state => state.task);
  const { leaves } = useAppSelector(state => state.leave);
  const { employees } = useAppSelector(state => state.employee);
  const titleOpacity = useAnimatedValue(0, { duration: 1000 });
  const toast = useToast();

  const [taskPage, setTaskPage] = useState(1);
  const [leavePage, setLeavePage] = useState(1);
  const [employeePage, setEmployeePage] = useState(1);

  const paginatedTasks = tasks.slice(0, taskPage * ITEMS_PER_PAGE);
  const paginatedLeaves = leaves.slice(0, leavePage * ITEMS_PER_PAGE);
  const paginatedEmployees = employees.slice(0, employeePage * ITEMS_PER_PAGE);

  const handleTaskComplete = async (taskId: string) => {
    await dispatch(updateTaskStatus({ taskId, status: 'completed' }));
  };

  const handleLeaveAction = async (leaveId: string, status: 'approved' | 'rejected') => {
    if (role !== 'admin' && role !== 'manager') {
      return;
    }
    await dispatch(updateLeaveStatus({ leaveId, status }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Tableau de Bord
      </Animated.Text>

      <Section
        title="Tâches en Cours"
        data={paginatedTasks.filter(task => task.status !== 'completed')}
        renderContent={(data) => (
          <View>
            {data.map(task => (
              <View key={task.id} style={styles.item}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemText}>{task.title}</Text>
                  <Text style={styles.itemSubText}>
                    {`Assigné à: ${task.employeeName || 'Non assigné'}`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.actionButtonSmall, { backgroundColor: colors.success }]}
                  onPress={() => handleTaskComplete(task.id)}
                >
                  <Ionicons name="checkmark-outline" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            {tasks.length > taskPage * ITEMS_PER_PAGE && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => setTaskPage(prev => prev + 1)}
              >
                <Text style={styles.loadMoreText}>Charger plus de tâches</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {(role === 'admin' || role === 'manager') && (
        <Section
          title="Demandes de Congés"
          data={paginatedLeaves.filter(leave => leave.status === 'pending')}
          renderContent={(data) => (
            <View>
              {data.map(leave => (
                <View key={leave.id} style={styles.item}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemText}>{leave.employeeName}</Text>
                    <Text style={styles.itemSubText}>{`${leave.startDate} - ${leave.endDate}`}</Text>
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionButtonSmall, { backgroundColor: colors.success }]}
                      onPress={() => handleLeaveAction(leave.id, 'approved')}
                    >
                      <Ionicons name="checkmark-outline" size={20} color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButtonSmall, { backgroundColor: colors.error }]}
                      onPress={() => handleLeaveAction(leave.id, 'rejected')}
                    >
                      <Ionicons name="close-outline" size={20} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {leaves.length > leavePage * ITEMS_PER_PAGE && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={() => setLeavePage(prev => prev + 1)}
                >
                  <Text style={styles.loadMoreText}>Charger plus de congés</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      <Section
        title="Équipe"
        data={paginatedEmployees}
        renderContent={(data) => (
          <View>
            {data.map(employee => (
              <View key={employee.id} style={styles.item}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemText}>
                    {`${employee.firstName} ${employee.lastName}`}
                  </Text>
                  <Text style={styles.itemSubText}>{employee.phone}</Text>
                </View>
                <View style={styles.statusIndicator} />
              </View>
            ))}
            {employees.length > employeePage * ITEMS_PER_PAGE && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => setEmployeePage(prev => prev + 1)}
              >
                <Text style={styles.loadMoreText}>Charger plus d'employés</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {(role === 'admin' || role === 'manager') && (
        <Section
          title="Rapports"
          data={[]}
          renderContent={(data) => (
            <View style={styles.reportButtons}>
              <TouchableOpacity 
                style={[styles.reportButton, { backgroundColor: colors.primary }]}
                onPress={() => toast.info('Génération du rapport en cours...')}
              >
                <Ionicons name="stats-chart" size={24} color={colors.white} />
                <Text style={styles.buttonText}>Rapport de Présence</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.reportButton, { backgroundColor: colors.secondary }]}
                onPress={() => toast.info('Génération du rapport en cours...')}
              >
                <Ionicons name="people" size={24} color={colors.white} />
                <Text style={styles.buttonText}>Rapport d'Équipe</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: colors.border,
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
  },
  itemSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },
  actionButtonSmall: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  reportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 10,
  },
  reportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  loadMoreButton: {
    padding: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: colors.primary,
    fontWeight: '500',
  },
});

export default DashboardScreen;
