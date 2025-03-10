import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SupportScreen = () => {
  const [issueDescription, setIssueDescription] = useState('');

  const handleSubmit = () => {
    // Logique pour soumettre la demande de support
    console.log('Demande de support soumise:', issueDescription);
    setIssueDescription('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support</Text>
      <TextInput
        style={styles.input}
        placeholder="Décrivez votre problème"
        value={issueDescription}
        onChangeText={setIssueDescription}
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
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default SupportScreen;

