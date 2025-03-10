import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert } from 'react-native';
import { Benefit } from '../types';

const BenefitsManagementScreen: React.FC = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddBenefit = () => {
    if (!name || !description) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    // Vérification des doublons
    const existingBenefit = benefits.find(benefit => benefit.name === name);
    if (existingBenefit) {
      Alert.alert("Erreur", "Cet avantage existe déjà.");
      return;
    }

    const newBenefit = { id: new Date().toISOString(), name, description, status: 'actif' }; // Ajout du statut
    setBenefits([...benefits, newBenefit]);
    setName('');
    setDescription('');
    Alert.alert("Succès", "Avantage ajouté avec succès.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Benefits Management Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom de l'Avantage"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button 
        title="Ajouter un Avantage" 
        onPress={handleAddBenefit} 
        accessibilityLabel="Ajouter un avantage" 
      />
      <FlatList
        data={benefits}
        keyExtractor={(item) => item.id} // Utilisation d'un identifiant unique
        renderItem={({ item }) => (
          <View style={styles.benefitItem}>
            <Text>{`${item.name}: ${item.description} (Statut: ${item.status})`}</Text>
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
  benefitItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default BenefitsManagementScreen;

