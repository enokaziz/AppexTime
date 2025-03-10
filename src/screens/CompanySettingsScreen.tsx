import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert } from 'react-native';
import { CompanySetting } from '../types';

const CompanySettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<CompanySetting[]>([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleAddSetting = () => {
    if (!name || !value) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    // Vérification des doublons
    const existingSetting = settings.find(setting => setting.name === name);
    if (existingSetting) {
      Alert.alert("Erreur", "Ce paramètre existe déjà.");
      return;
    }

    const newSetting = { id: new Date().toISOString(), name, value, status: 'actif' }; // Ajout du statut
    setSettings([...settings, newSetting]);
    setName('');
    setValue('');
    Alert.alert("Succès", "Paramètre ajouté avec succès.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Company Settings Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du Paramètre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Valeur du Paramètre"
        value={value}
        onChangeText={setValue}
      />
      <Button 
        title="Ajouter un Paramètre" 
        onPress={handleAddSetting} 
        accessibilityLabel="Ajouter un paramètre" 
      />
      <FlatList
        data={settings}
        keyExtractor={(item) => item.id} // Utilisation d'un identifiant unique
        renderItem={({ item }) => (
          <View style={styles.settingItem}>
            <Text>{`${item.name}: ${item.value} (Statut: ${item.status})`}</Text>
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
  settingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CompanySettingsScreen;

