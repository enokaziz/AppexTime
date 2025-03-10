import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createResponsible } from '../services/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';

type CreateResponsibleScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'CreateResponsible'>;

const CreateResponsibleScreen = ({ navigation }: { navigation: CreateResponsibleScreenNavigationProp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCreateResponsible = async () => {
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const success = await createResponsible(email, password);
      if (success) {
        setSuccess(true);
        setError('');
      } else {
        setError('Creation failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Creation error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Responsible</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {success && <Text style={styles.successText}>Responsible created successfully.</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button 
        title="Create Responsible" 
        onPress={handleCreateResponsible} 
        accessibilityLabel="Créer un responsable" 
      />
      <Button title="Back to Admin Dashboard" onPress={() => navigation.navigate('AdminDashboard')} />
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  successText: {
    color: 'green',
  },
  errorText: {
    color: 'red',
  },
});

export default CreateResponsibleScreen;

