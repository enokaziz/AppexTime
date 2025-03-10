import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface Absence {
  startDate: string;
  endDate: string;
  reason: string;
}

interface Props {
  navigation: NavigationProp<any>;
}

const AbsenceScreen: React.FC<Props> = ({ navigation }) => {
  const [absencesList, setAbsencesList] = useState<Absence[]>([
    { startDate: '2023-01-01', endDate: '2023-01-05', reason: 'Vacances' },
    { startDate: '2023-02-10', endDate: '2023-02-12', reason: 'Maladie' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Absences</Text>
      <Button title="Gérer les Absences" onPress={() => navigation.navigate('AbsenceManagementScreen')} />
      
      <FlatList
        data={absencesList}
keyExtractor={(item) => item.startDate + item.endDate} // Utilisation d'un identifiant unique
        renderItem={({ item }) => (
          <View style={styles.absenceItem}>
            <Text>{`Du ${item.startDate} au ${item.endDate}: ${item.reason}`}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  absenceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AbsenceScreen;
