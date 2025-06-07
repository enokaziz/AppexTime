import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface LeaveRequest {
  employeeName: string;
  startDate: Date;
  endDate: Date;
}

interface ValidationErrors {
  employeeName?: string;
  startDate?: string;
  endDate?: string;
}

// Liste des jours fériés en France (à compléter selon vos besoins)
const HOLIDAYS = [
  new Date(2024, 0, 1), // Jour de l'an
  new Date(2024, 3, 1), // Lundi de Pâques
  new Date(2024, 4, 1), // Fête du Travail
  new Date(2024, 4, 8), // Victoire 1945
  new Date(2024, 4, 30), // Ascension
  new Date(2024, 6, 14), // Fête Nationale
  new Date(2024, 7, 15), // Assomption
  new Date(2024, 10, 1), // Toussaint
  new Date(2024, 10, 11), // Armistice 1918
  new Date(2024, 11, 25), // Noël
];

const SubmitLeaveScreen: React.FC = () => {
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>({
    employeeName: '',
    startDate: new Date(),
    endDate: new Date(),
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Animations
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isHoliday = (date: Date): boolean => {
    return HOLIDAYS.some(
      (holiday) =>
        holiday.getDate() === date.getDate() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getFullYear() === date.getFullYear(),
    );
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!leaveRequest.employeeName.trim()) {
      newErrors.employeeName = "Le nom de l'employé est requis";
    }

    if (isWeekend(leaveRequest.startDate)) {
      newErrors.startDate = 'La date de début ne peut pas être un weekend';
    }

    if (isHoliday(leaveRequest.startDate)) {
      newErrors.startDate = 'La date de début ne peut pas être un jour férié';
    }

    if (isWeekend(leaveRequest.endDate)) {
      newErrors.endDate = 'La date de fin ne peut pas être un weekend';
    }

    if (isHoliday(leaveRequest.endDate)) {
      newErrors.endDate = 'La date de fin ne peut pas être un jour férié';
    }

    if (leaveRequest.endDate < leaveRequest.startDate) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }

    // Calcul de la durée du congé
    const diffTime = Math.abs(
      leaveRequest.endDate.getTime() - leaveRequest.startDate.getTime(),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      newErrors.endDate = 'La durée maximale de congé est de 30 jours';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs avant de soumettre');
      return;
    }

    try {
      // TODO: Implémenter l'appel API ici
      console.log('Demande de congé soumise:', leaveRequest);
      Alert.alert('Succès', 'Votre demande de congé a été soumise avec succès');

      // Réinitialiser le formulaire
      setLeaveRequest({
        employeeName: '',
        startDate: new Date(),
        endDate: new Date(),
      });
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la soumission');
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.title}>Soumettre une Demande de Congé</Text>

      <TextInput
        style={[styles.input, errors.employeeName && styles.inputError]}
        placeholder="Nom de l'employé"
        value={leaveRequest.employeeName}
        onChangeText={(text) =>
          setLeaveRequest({ ...leaveRequest, employeeName: text })
        }
      />
      {errors.employeeName && (
        <Text style={styles.errorText}>{errors.employeeName}</Text>
      )}

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date de début:</Text>
        <Button
          title={leaveRequest.startDate.toLocaleDateString()}
          onPress={() => setShowStartDatePicker(true)}
        />
        {showStartDatePicker && (
          <DateTimePicker
            value={leaveRequest.startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setLeaveRequest({ ...leaveRequest, startDate: selectedDate });
              }
            }}
          />
        )}
        {errors.startDate && (
          <Text style={styles.errorText}>{errors.startDate}</Text>
        )}
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date de fin:</Text>
        <Button
          title={leaveRequest.endDate.toLocaleDateString()}
          onPress={() => setShowEndDatePicker(true)}
        />
        {showEndDatePicker && (
          <DateTimePicker
            value={leaveRequest.endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setLeaveRequest({ ...leaveRequest, endDate: selectedDate });
              }
            }}
          />
        )}
        {errors.endDate && (
          <Text style={styles.errorText}>{errors.endDate}</Text>
        )}
      </View>

      <Button title="Soumettre" onPress={handleSubmit} />
    </Animated.View>
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  dateContainer: {
    marginBottom: 15,
  },
  dateLabel: {
    marginBottom: 5,
    fontSize: 16,
  },
});

export default SubmitLeaveScreen;
