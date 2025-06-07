import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// Définir l'interface pour les tâches
interface Task {
  id: string;
  title: string;
}

const TaskManagementScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskId, setTaskId] = useState<string | null>(null);

  const handleAddTask = () => {
    if (taskTitle) {
      setTasks([...tasks, { id: Math.random().toString(), title: taskTitle }]);
      setTaskTitle('');
    }
  };

  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setTaskTitle(taskToEdit.title);
      setTaskId(id);
    }
  };

  const handleUpdateTask = () => {
    if (taskId) {
      setTasks(tasks.map(task => (task.id === taskId ? { ...task, title: taskTitle } : task)));
      setTaskTitle('');
      setTaskId(null);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Tâches</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre de la tâche"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <Button title={taskId ? "Mettre à jour" : "Ajouter"} onPress={taskId ? handleUpdateTask : handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.title}</Text>
            <TouchableOpacity onPress={() => handleEditTask(item.id)}>
              <Text style={styles.editButton}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <Text style={styles.deleteButton}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  editButton: {
    color: 'blue',
  },
  deleteButton: {
    color: 'red',
  },
});

export default TaskManagementScreen;

