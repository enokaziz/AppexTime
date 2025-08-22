import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { updateTaskStatus } from '../../store/slices/taskSlice';
import { updateLeaveStatus } from '../../store/slices/leaveSlice';
import { theme } from '../../styles/theme';
import { useToast } from '../../hooks/useToast';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';
import { Ionicons } from '@expo/vector-icons';

interface SectionProps {
  title: string;
  data: any[];
  renderContent: (data: any[]) => JSX.Element;
  actionText?: string;
  onAction?: () => void;
}

const Section = React.memo(
  ({ title, data, renderContent, actionText, onAction }: SectionProps) => {
    const opacity = useAnimatedValue(0);

    return (
      <Animated.View style={[styles.section, { opacity }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {actionText && onAction && (
            <TouchableOpacity style={styles.actionButton} onPress={onAction}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={theme.colors.white}
              />
              <Text style={styles.buttonText}>{actionText}</Text>
            </TouchableOpacity>
          )}
        </View>
        {data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="information-circle-outline"
              size={48}
              color={theme.colors.border}
            />
            <Text style={styles.emptyText}>Aucune donnée disponible</Text>
            <Text style={styles.emptySubText}>
              Les données apparaîtront ici
            </Text>
          </View>
        ) : (
          renderContent(data)
        )}
      </Animated.View>
    );
  },
);

const ITEMS_PER_PAGE = 5;

const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.task);
  const { leaves } = useAppSelector((state) => state.leave);
  const { employees } = useAppSelector((state) => state.employee);
  const titleOpacity = useAnimatedValue(0, { duration: 1000 });
  const toast = useToast();

  const [taskPage, setTaskPage] = useState(1);
  const [leavePage, setLeavePage] = useState(1);
  const [employeePage, setEmployeePage] = useState(1);

  const paginatedTasks = tasks.slice(0, taskPage * ITEMS_PER_PAGE);
  const paginatedLeaves = leaves.slice(0, leavePage * ITEMS_PER_PAGE);
  const paginatedEmployees = employees.slice(0, employeePage * ITEMS_PER_PAGE);

  const handleTaskComplete = async (taskId: string) => {
    if (!user?.id) return;
    await dispatch(
      updateTaskStatus({
        taskId,
        status: 'completed',
        employeeId: user.id,
      }),
    );
  };

  const handleLeaveAction = async (
    leaveId: string,
    status: 'approved' | 'rejected',
  ) => {
    if (!user?.id) return;
    if (user.role !== 'admin' && user.role !== 'manager') {
      return;
    }
    await dispatch(
      updateLeaveStatus({
        leaveId,
        status,
        employeeId: user.id,
      }),
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        📊 Tableau de Bord
      </Animated.Text>

      <Section
        title="✅ Tâches en Cours"
        data={paginatedTasks.filter((task) => task.status !== 'completed')}
        renderContent={(data) => (
          <View>
            {data.map((task) => (
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
                    { backgroundColor: theme.colors.success },
                  ]}
                  onPress={() => handleTaskComplete(task.id)}
                >
                  <Ionicons
                    name="checkmark-outline"
                    size={20}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              </View>
            ))}
            {tasks.length > taskPage * ITEMS_PER_PAGE && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => setTaskPage((prev) => prev + 1)}
              >
                <Text style={styles.loadMoreText}>Charger plus de tâches</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {(user?.role === 'admin' || user?.role === 'manager') && (
        <Section
          title="📅 Demandes de Congés"
          data={paginatedLeaves.filter((leave) => leave.status === 'pending')}
          renderContent={(data) => (
            <View>
              {data.map((leave) => (
                <View key={leave.id} style={styles.item}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemText}>{leave.employeeName}</Text>
                    <Text
                      style={styles.itemSubText}
                    >{`${leave.startDate} - ${leave.endDate}`}</Text>
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[
                        styles.actionButtonSmall,
                        { backgroundColor: theme.colors.success },
                      ]}
                      onPress={() => handleLeaveAction(leave.id, 'approved')}
                    >
                      <Ionicons
                        name="checkmark-outline"
                        size={20}
                        color={theme.colors.white}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButtonSmall,
                        { backgroundColor: theme.colors.error },
                      ]}
                      onPress={() => handleLeaveAction(leave.id, 'rejected')}
                    >
                      <Ionicons
                        name="close-outline"
                        size={20}
                        color={theme.colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {leaves.length > leavePage * ITEMS_PER_PAGE && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={() => setLeavePage((prev) => prev + 1)}
                >
                  <Text style={styles.loadMoreText}>
                    Charger plus de congés
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      <Section
        title="👥 Équipe"
        data={paginatedEmployees}
        renderContent={(data) => (
          <View>
            {data.map((employee) => (
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
                onPress={() => setEmployeePage((prev) => prev + 1)}
              >
                <Text style={styles.loadMoreText}>Charger plus d'employés</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {(user?.role === 'admin' || user?.role === 'manager') && (
        <Section
          title="📈 Rapports"
          data={[]}
          renderContent={(data) => (
            <View style={styles.reportButtons}>
              <TouchableOpacity
                style={[
                  styles.reportButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => toast.info('Génération du rapport en cours...')}
              >
                <Ionicons
                  name="stats-chart"
                  size={24}
                  color={theme.colors.white}
                />
                <Text style={styles.buttonText}>Rapport de Présence</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.reportButton,
                  { backgroundColor: theme.colors.accent },
                ]}
                onPress={() => toast.info('Génération du rapport en cours...')}
              >
                <Ionicons name="people" size={24} color={theme.colors.white} />
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
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  emptyText: {
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubText: {
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    fontSize: 14,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: theme.colors.textDark,
    fontWeight: '500',
  },
  itemSubText: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  actionButtonSmall: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
  },
  reportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  reportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  loadMoreButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
  },
  loadMoreText: {
    color: theme.colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: theme.spacing.xs,
  },
});

export default DashboardScreen;
