import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { generateBadge } from '../utils/generateBadge';
import { generateQRCode } from '../utils/qrCodeGenerator';
import { useNavigation } from '@react-navigation/native';
import { Employee } from '../types/index';

const GenerateBadgeScreen = () => {
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photo, setPhoto] = useState('');
  const navigation = useNavigation();

  const handleGenerateBadge = async () => {
    try {
      const employee: Employee = {
        name,
        firstName,
        phoneNumber,
        photo,
        id: `${name.substring(0, 2).toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}`,
        companyInitials: '',
        qrCodeUrl: '',
        uniqueId: ''
      };
      const badge = await generateBadge(employee);
      const qrCode = await generateQRCode(employee.id);
      console.log('Badge generated:', badge);
      console.log('QR Code generated:', qrCode);
      navigation.goBack();
    } catch (error) {
      console.error('Generate badge error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Générer un Badge</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de Téléphone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Photo (URL)"
        value={photo}
        onChangeText={setPhoto}
      />
      <Button title="Générer" onPress={handleGenerateBadge} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default GenerateBadgeScreen;
