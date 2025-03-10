import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SubmitLeaveScreen = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = () => {
    // Logique pour soumettre la demande de congé
    console.log('Demande de congé soumise:', { employeeName, startDate, endDate });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soumettre une Demande de Congé</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom de l'employé"
        value={employeeName}
        onChangeText={setEmployeeName}
      />
      <TextInput
        style={styles.input}
        placeholder="Date de début (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Date de fin (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />
      <Button title="Soumettre" onPress={handleSubmit} />
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
});

export default SubmitLeaveScreen;
