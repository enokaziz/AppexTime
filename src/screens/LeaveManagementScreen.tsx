import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getLeaves, addLeave } from '@services/leave'; // Importer les services
import { Leave } from '../types/index'; // Importer le type Leave

const LeaveManagementScreen = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const leavesData = await getLeaves();
      const formattedLeaves = leavesData.map(leave => {
        if (leave.startDate && leave.endDate && leave.reason) {
          return {
            id: leave.id,
            startDate: leave.startDate,
            endDate: leave.endDate,
            reason: leave.reason,
          };
        }
        return null; // Ignorer les entrées incomplètes
      }).filter(leave => leave !== null) as Leave[]; // Filtrer les entrées null et forcer le type
      setLeaves(formattedLeaves);
    };
    fetchLeaves();
  }, []);

  const handleAddLeave = async () => {
    const newLeave: Leave = {
      id: new Date().toISOString(), // Simple ID generation using timestamp
      startDate,
      endDate,
      reason,
    };
    await addLeave(newLeave);
    setStartDate('');
    setEndDate('');
    setReason('');
    // Recharger les demandes de congé
    const leavesData = await getLeaves();
    const formattedLeaves = leavesData.map(leave => ({
      id: leave.id,
      startDate: leave.startDate || '',
      endDate: leave.endDate || '',
      reason: leave.reason || '',
    }));
    setLeaves(formattedLeaves);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demande de Congé</Text>
      <TextInput
        placeholder="Date de début"
        value={startDate}
        onChangeText={setStartDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Date de fin"
        value={endDate}
        onChangeText={setEndDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Motif"
        value={reason}
        onChangeText={setReason}
        style={styles.input}
      />
      <Button title="Soumettre" onPress={handleAddLeave} />
      <FlatList
        data={leaves}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.leaveItem}>
            <Text>{`${item.startDate} - ${item.endDate}: ${item.reason}`}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  leaveItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
export default LeaveManagementScreen;

