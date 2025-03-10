import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Employee } from '../../types/index';

type EmployeePortalScreenProps = {
  route: RouteProp<{ params: { employee: Employee } }, 'params'>;
  navigation: StackNavigationProp<AuthStackParamList, 'EmployeePortal'>;
};

const EmployeePortalScreen: React.FC<EmployeePortalScreenProps> = ({ route, navigation }) => {
  const { employee } = route.params;
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const contentTranslateY = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Détails de l'Employé
      </Animated.Text>
      <Animated.View style={[styles.infoContainer, { transform: [{ translateY: contentTranslateY }] }]}>
        <Text style={styles.name}>{`${employee.firstName} ${employee.name}`}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Téléphone :</Text>
          <Text style={styles.value}>{employee.phoneNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Photo :</Text>
          <Text style={styles.value}>{employee.photo || 'Non définie'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Initiales Entreprise :</Text>
          <Text style={styles.value}>{employee.companyInitials}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>ID Unique :</Text>
          <Text style={styles.value}>{employee.uniqueId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>URL QR Code :</Text>
          <Text style={styles.value}>{employee.qrCodeUrl || 'Non généré'}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('GenerateBadge', { employee })}
        >
          <Text style={styles.buttonText}>Générer Badge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditEmployee', { employeeId: employee.id })}
        >
          <Text style={styles.buttonText}>Modifier Employé</Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 120,
  },
  value: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmployeePortalScreen;