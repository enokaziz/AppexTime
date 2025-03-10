import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import useEmployee from '@hooks/useEmployee';
import useLeave from '@hooks/useLeave';
import useTasks from '@hooks/useTasks';
import usePerformance from '@hooks/usePerformance';
import { Employee, Leave, Task } from '../types/index';
import Toast from 'react-native-toast-message';

const SectionList: React.FC<{
  title: string;
  data: any[];
  keyExtractor: (item: any) => string;
  renderItem: (item: any) => JSX.Element;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, data, keyExtractor, renderItem, actionText, onAction }) => {
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
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderItem(item)}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune donnée</Text>}
      />
      {actionText && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.buttonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const AdminDashboardScreen: React.FC = () => {
  const { employees, handleAddEmployee, handleUpdateEmployee, handleDeleteEmployee } = useEmployee();
  const { leaves, setLeaves } = useLeave();
  const { tasks, setTasks } = useTasks();
  const { evaluatePerformance } = usePerformance();
  const [isLoading, setIsLoading] = useState(false);
  const titleOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const confirmDeleteEmployee = (id: string) => {
    Toast.show({
      type: 'info',
      text1: 'Confirmation',
      text2: 'Voulez-vous supprimer cet employé ?',
      onPress: async () => {
        setIsLoading(true);
        try {
          await handleDeleteEmployee(id);
          Toast.show({ type: 'success', text1: 'Succès', text2: 'Employé supprimé.' });
        } catch (err) {
          Toast.show({ type: 'error', text1: 'Erreur', text2: 'Échec de la suppression.' });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleAddNewEmployee = async () => {
    setIsLoading(true);
    try {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: 'Nouvel Employé',
        firstName: 'Jean',
        phoneNumber: '1234567890',
        photo: '',
        companyInitials: 'ABC',
        qrCodeUrl: '',
        uniqueId: `EMP${Date.now()}`,
      };
      await handleAddEmployee(newEmployee);
      Toast.show({ type: 'success', text1: 'Succès', text2: 'Employé ajouté.' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'Échec de l’ajout.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    setIsLoading(true);
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: 'Nouvelle Tâche',
        description: 'Description ici',
        assignedTo: employees[0]?.id || '',
        completed: false,
        employeeName: employees[0]?.name || 'Non assigné',
        employeeId: employees[0]?.id || '',
        status: 'pending',
        dueDate: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
      Toast.show({ type: 'success', text1: 'Succès', text2: 'Tâche ajoutée.' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'Échec de l’ajout.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Tableau de Bord Admin
      </Animated.Text>

      <SectionList
        title="Gestion des Employés"
        data={employees}
        keyExtractor={(item: Employee) => item.id}
        renderItem={(item: Employee) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButtonSmall} onPress={() => handleUpdateEmployee(item)}>
                <Text style={styles.actionText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButtonSmall, styles.deleteButton]} onPress={() => confirmDeleteEmployee(item.id)}>
                <Text style={styles.actionText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        actionText="Ajouter un Employé"
        onAction={handleAddNewEmployee}
      />

      <SectionList
        title="Gestion des Congés"
        data={leaves}
        keyExtractor={(item: Leave) => item.id}
        renderItem={(item: Leave) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.employeeId}</Text>
            <Text style={styles.itemSubText}>{`${item.startDate} - ${item.endDate}`}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButtonSmall}
                onPress={() => {
                  setLeaves(leaves.filter((leave) => leave.id !== item.id));
                  Toast.show({ type: 'success', text1: 'Succès', text2: 'Congé approuvé.' });
                }}
              >
                <Text style={styles.actionText}>Approuver</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButtonSmall, styles.deleteButton]}
                onPress={() => {
                  setLeaves(leaves.filter((leave) => leave.id !== item.id));
                  Toast.show({ type: 'success', text1: 'Succès', text2: 'Congé refusé.' });
                }}
              >
                <Text style={styles.actionText}>Refuser</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <SectionList
        title="Gestion des Tâches"
        data={tasks}
        keyExtractor={(item: Task) => item.id}
        renderItem={(item: Task) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
            <Text style={styles.itemSubText}>{item.assignedTo || 'Non assigné'}</Text>
            <TouchableOpacity
              style={styles.actionButtonSmall}
              onPress={() => {
                setTasks(tasks.filter((task) => task.id !== item.id));
                Toast.show({ type: 'success', text1: 'Succès', text2: 'Tâche terminée.' });
              }}
            >
              <Text style={styles.actionText}>Terminer</Text>
            </TouchableOpacity>
          </View>
        )}
        actionText="Ajouter une Tâche"
        onAction={handleAddTask}
      />

      <SectionList
        title="Gestion des Performances"
        data={employees}
        keyExtractor={(item: Employee) => item.id}
        renderItem={(item: Employee) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity style={styles.actionButtonSmall} onPress={() => evaluatePerformance(item.id)}>
              <Text style={styles.actionText}>Évaluer</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <SectionList
        title="Gestion des Rapports"
        data={[]}
        keyExtractor={() => 'report'}
        renderItem={() => <View />}
        actionText="Générer un Rapport"
        onAction={() => Toast.show({ type: 'info', text1: 'Rapport', text2: 'Fonctionnalité à implémenter.' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  itemSubText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonSmall: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    padding: 10,
  },
});

export default AdminDashboardScreen;