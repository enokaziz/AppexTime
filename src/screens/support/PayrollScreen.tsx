import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const payrollData = [
  { id: '1', name: 'John Doe', hoursWorked: 40, deductions: 100 },
  { id: '2', name: 'Jane Smith', hoursWorked: 38, deductions: 50 },
  // Ajoutez d'autres données de paie si nécessaire
];

const PayrollScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails de la Paie</Text>
      <FlatList
        data={payrollData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Text>Heures travaillées: {item.hoursWorked}</Text>
            <Text>Déductions: {item.deductions} €</Text>
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
  item: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default PayrollScreen;

