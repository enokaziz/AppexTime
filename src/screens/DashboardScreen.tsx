import React from 'react';
import { useAuth } from '@contexts/AuthContext'; // Importer le contexte d'authentification
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLeave } from '@contexts/LeaveContext';
import { useTasks } from '@contexts/TaskContext';
import useEmployee from '@hooks/useEmployee';
import usePerformance from '@hooks/usePerformance';

const DashboardScreen = () => {
  const { user, role } = useAuth(); // Récupérer l'utilisateur et son rôle
  const { employees } = useEmployee();
  const { leaves, approveLeave, rejectLeave } = useLeave();
  const { tasks, assignTask, completeTask } = useTasks();
  const { performances, evaluatePerformance } = usePerformance();

  const handleApproveLeave = (id: string) => {
    if (!id) {
      Alert.alert("Erreur", "L'ID du congé est requis pour l'approbation.");
      return;
    }
    if (!user || role !== 'admin') { // Vérification du rôle
      Alert.alert("Erreur", "Vous n'avez pas les autorisations nécessaires pour approuver ce congé.");
      return;
    }
    Alert.alert(
      "Confirmer",
      "Êtes-vous sûr de vouloir approuver ce congé ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Approuver", onPress: () => approveLeave(id) }
      ]
    );
  };

  const handleRejectLeave = (id: string) => {
    if (!user || role !== 'admin') { // Vérification du rôle
      Alert.alert("Erreur", "Vous n'avez pas les autorisations nécessaires pour refuser ce congé.");
      return;
    }
    Alert.alert(
      "Confirmer",
      "Êtes-vous sûr de vouloir refuser ce congé ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Refuser", onPress: () => rejectLeave(id) }
      ]
    );
  };

  const handleEvaluatePerformance = (id: string) => {
    if (!user || role !== 'admin') { // Vérification du rôle
      Alert.alert("Erreur", "Vous n'avez pas les autorisations nécessaires pour évaluer les performances.");
      return;
    }
    evaluatePerformance(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tâches en Cours</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text>{item.title}</Text>
              <Text>{item.employeeName}</Text>
              <TouchableOpacity 
                onPress={() => completeTask(item.id)} 
                accessibilityLabel="Marquer la tâche comme terminée" 
                accessible={true} 
              >
                <Text>Marquer comme Terminée</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity onPress={() => assignTask({
          id: Date.now().toString(),
          title: 'New Task',
          description: '',
          completed: false,
          employeeName: 'John Doe',
          employeeId: '1',
          assignedTo: undefined
        })}>
          <Text>Ajouter une Tâche</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <FlatList
          data={leaves}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Text>{item.employeeName}</Text>
              <Text>{item.startDate} - {item.endDate}</Text>
              <TouchableOpacity onPress={() => handleApproveLeave(item.id)}>
                <Text>Approuver</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRejectLeave(item.id)}>
                <Text>Refuser</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rapports</Text>
        <TouchableOpacity onPress={() => console.log('Générer un Rapport')}>
          <Text>Générer un Rapport</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performances</Text>
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.performanceItem}>
              <Text>{item.name}</Text>
              <TouchableOpacity onPress={() => handleEvaluatePerformance(item.id)}>
                <Text>Évaluer</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default DashboardScreen;
