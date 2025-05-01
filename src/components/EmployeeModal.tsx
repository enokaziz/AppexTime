import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import useEmployee from '@hooks/useEmployee';
import { Employee } from '../types/index';

interface EmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  employeeId?: string;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  visible,
  onClose,
  employeeId,
}) => {
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photo, setPhoto] = useState('');
  const [companyInitials, setCompanyInitials] = useState('');
  const { handleAddEmployee, handleUpdateEmployee, handleGetEmployee } =
    useEmployee();

  useEffect(() => {
    if (employeeId) {
      handleGetEmployee(employeeId).then((employee) => {
        if (employee) {
          setName(employee.name);
          setFirstName(employee.firstName);
          setPhoneNumber(employee.phoneNumber);
          setPhoto(employee.photo);
          setCompanyInitials(employee.companyInitials);
        }
      });
    }
  }, [employeeId, handleGetEmployee]);

  const handleSave = async () => {
    if (employeeId) {
      await handleUpdateEmployee({
        id: employeeId,
        name,
        firstName,
        phoneNumber,
        photo,
        companyInitials,
        qrCodeUrl: '', 
        uniqueId: `EMP-${Date.now()}` 
      });
    } else {
      await handleAddEmployee(
        name,
        firstName,
        phoneNumber,
        photo,
        companyInitials,
        '', 
        `EMP-${Date.now()}` 
      );
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Gestion des Employés</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nom"
            style={styles.input}
          />
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Prénom"
            style={styles.input}
          />
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Numéro de téléphone"
            style={styles.input}
          />
          <TextInput
            value={photo}
            onChangeText={setPhoto}
            placeholder="Photo"
            style={styles.input}
          />
          <TextInput
            value={companyInitials}
            onChangeText={setCompanyInitials}
            placeholder="Initiales de l'entreprise"
            style={styles.input}
          />
          <Button title="Enregistrer" onPress={handleSave} />
          <Button title="Annuler" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default EmployeeModal;
