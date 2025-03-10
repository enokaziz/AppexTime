import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert, TouchableOpacity } from 'react-native';

interface Attendance {
  employeeId: string;
  date: string;
  status: string;
}

const AttendanceScreen: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');

  const handleAddAttendance = () => {
    // Validation du statut
    if (status !== 'Présent' && status !== 'Absent') {
      Alert.alert("Erreur", "Le statut doit être 'Présent' ou 'Absent'.");
      return;
    }
    if (!employeeId || !status) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    const newAttendance = { employeeId, date: new Date().toISOString().split('T')[0], status };
    setAttendanceList([...attendanceList, newAttendance]);
    setEmployeeId('');
    setStatus('');
    Alert.alert("Succès", "Présence ajoutée avec succès.");
  };

  const handleDeleteAttendance = (employeeId: string, date: string) => {
    setAttendanceList(attendanceList.filter(item => item.employeeId !== employeeId || item.date !== date));
    Alert.alert("Succès", "Enregistrement supprimé avec succès.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
      />
      <TextInput
        style={styles.input}
        placeholder="Status (Present/Absent)"
        value={status}
        onChangeText={setStatus}
      />
      <Button 
        title="Add Attendance" 
        onPress={handleAddAttendance} 
        accessibilityLabel="Ajouter une présence" 
      />
      <FlatList
        data={attendanceList}
        keyExtractor={(item) => item.employeeId + item.date} // Utilisation d'un identifiant unique
        renderItem={({ item }) => (
          <View style={styles.attendanceItem}>
            <Text>{`Employee ID: ${item.employeeId}, Date: ${item.date}, Status: ${item.status}`}</Text>
            <TouchableOpacity onPress={() => handleDeleteAttendance(item.employeeId, item.date)}>
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
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  attendanceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    color: 'red',
  },
});

export default AttendanceScreen;

