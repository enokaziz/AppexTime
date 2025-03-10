import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';

interface Absence {
  startDate: string;
  endDate: string;
  reason: string;
  status: string; // Ajout du statut
}

const AbsenceManagementScreen = () => {
  const [absence, setAbsence] = useState<Absence>({ startDate: '', endDate: '', reason: '', status: 'en attente' });
  const [absencesList, setAbsencesList] = useState<Absence[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleInputChange = (name: keyof Absence, value: string) => {
    setAbsence({ ...absence, [name]: value });
  };

  const handleSubmit = () => {
    if (!absence.startDate || !absence.endDate || !absence.reason) {
      setError('Tous les champs doivent être remplis.');
      return;
    }

    // Validation des dates
    if (new Date(absence.startDate) >= new Date(absence.endDate)) {
      setError('La date de début doit être antérieure à la date de fin.');
      return;
    }

    setAbsencesList([...absencesList, { ...absence, status: 'en attente' }]);
    setAbsence({ startDate: '', endDate: '', reason: '', status: 'en attente' }); // Reset form
    setError('');
    setSuccessMessage('Absence ajoutée avec succès.');
  };

const handleDeleteAbsence = (index: number) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer cette absence ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", onPress: () => {
            const newAbsencesList = absencesList.filter((_, i) => i !== index);
            setAbsencesList(newAbsencesList);
            setSuccessMessage('Absence supprimée avec succès.');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des Absences</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      <TextInput
        placeholder="Date de début"
        value={absence.startDate}
        onChangeText={(value) => handleInputChange('startDate', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Date de fin"
        value={absence.endDate}
        onChangeText={(value) => handleInputChange('endDate', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Motif de l'absence"
        value={absence.reason}
        onChangeText={(value) => handleInputChange('reason', value)}
        style={styles.input}
      />
      <Button title="Soumettre" onPress={handleSubmit} />
      
      <FlatList
        data={absencesList}
keyExtractor={(item) => item.startDate + item.endDate} // Utilisation d'un identifiant unique
        renderItem={({ item, index }) => (
          <View style={styles.absenceItem}>
            <Text>{`Du ${item.startDate} au ${item.endDate}: ${item.reason} (Statut: ${item.status})`}</Text>
            <Button title="Supprimer" onPress={() => handleDeleteAbsence(index)} />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  absenceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  errorText: {
    color: 'red',
  },
  successText: {
    color: 'green',
  },
});

export default AbsenceManagementScreen;