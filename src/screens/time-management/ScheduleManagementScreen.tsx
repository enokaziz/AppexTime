import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';

const ScheduleManagementScreen: React.FC = () => {
  const [schedules, setSchedules] = useState<{ id: string; title: string }[]>([
    { id: '1', title: 'Réunion d\'équipe' },
    { id: '2', title: 'Présentation du projet' },
  ]);

  const addSchedule = () => {
    const newSchedule = { id: (schedules.length + 1).toString(), title: 'Nouvel Événement' };
    setSchedules([...schedules, newSchedule]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Horaires</Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.title}</Text>
          </View>
        )}
      />
      <Button title="Ajouter un Horaire" onPress={addSchedule} />
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
  item: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default ScheduleManagementScreen;

