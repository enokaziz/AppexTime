import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addAbsence, removeAbsence } from '../store/slices/absenceSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { absenceStyles } from '../styles/absenceStyles';

interface Absence {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: string;
}

const AbsenceManagementScreen = () => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [absence, setAbsence] = useState<Omit<Absence, 'id'>>({
    startDate: new Date(),
    endDate: new Date(),
    reason: '',
    status: 'en attente',
  });

  const dispatch = useAppDispatch();
  const absencesList = useAppSelector((state) => state.absence.list);

  const handleDateChange = (name: 'startDate' | 'endDate', date: Date) => {
    setAbsence({ ...absence, [name]: date });
    if (name === 'startDate') setShowStartDatePicker(false);
    else setShowEndDatePicker(false);
  };

  const handleSubmit = () => {
    if (!absence.reason) {
      Alert.alert('Erreur', 'Le motif doit être rempli');
      return;
    }

    if (absence.startDate >= absence.endDate) {
      Alert.alert(
        'Erreur',
        'La date de début doit être antérieure à la date de fin',
      );
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    const newAbsence = {
      ...absence,
      id: Date.now().toString(),
    };
    dispatch(addAbsence(newAbsence));
    setAbsence({
      startDate: new Date(),
      endDate: new Date(),
      reason: '',
      status: 'en attente',
    });
    setShowConfirmation(false);
  };

  const handleDeleteAbsence = (id: string) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette absence ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => dispatch(removeAbsence(id)) },
      ],
    );
  };

  return (
    <View style={absenceStyles.container}>
      <Text style={absenceStyles.title}>Gestion des Absences</Text>

      <TouchableOpacity
        onPress={() => setShowStartDatePicker(true)}
        style={absenceStyles.input}
      >
        <Text>Date de début: {absence.startDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showStartDatePicker && (
        <DateTimePicker
          value={absence.startDate}
          mode="date"
          onChange={(_, date) => date && handleDateChange('startDate', date)}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowEndDatePicker(true)}
        style={absenceStyles.input}
      >
        <Text>Date de fin: {absence.endDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showEndDatePicker && (
        <DateTimePicker
          value={absence.endDate}
          mode="date"
          onChange={(_, date) => date && handleDateChange('endDate', date)}
        />
      )}

      <TextInput
        placeholder="Motif de l'absence"
        value={absence.reason}
        onChangeText={(value) => setAbsence({ ...absence, reason: value })}
        style={absenceStyles.input}
      />

      <Button title="Soumettre" onPress={handleSubmit} />

      <Modal visible={showConfirmation} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}
          >
            <Text>Confirmer l'ajout de cette absence ?</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 20,
              }}
            >
              <Button
                title="Annuler"
                onPress={() => setShowConfirmation(false)}
              />
              <Button title="Confirmer" onPress={confirmSubmit} />
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={absencesList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={absenceStyles.absenceItem}>
            <Text>{`Du ${item.startDate.toLocaleDateString()} au ${item.endDate.toLocaleDateString()}: ${
              item.reason
            } (Statut: ${item.status})`}</Text>
            <Button
              title="Supprimer"
              onPress={() => handleDeleteAbsence(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default AbsenceManagementScreen;
