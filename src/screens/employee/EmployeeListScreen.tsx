import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Animated } from 'react-native';
import useEmployee from '../../hooks/useEmployee';
import { Employee } from '../../types/index';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import debounce from 'lodash/debounce';

type EmployeeListScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'EmployeeList'>;
};

const EmployeeListScreen: React.FC<EmployeeListScreenProps> = ({ navigation }) => {
  const { employees, handleDeleteEmployee } = useEmployee();
  const [searchQuery, setSearchQuery] = useState('');
  const listOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditEmployee = (employeeId: string) => {
    navigation.navigate('EditEmployee', { employeeId });
  };

  const handleDeleteEmployeeById = async (employeeId: string): Promise<void> => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cet employé ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await handleDeleteEmployee(employeeId);
            } catch (error) {
              Alert.alert('Erreur', 'Échec de la suppression de l\'employé.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{`${item.firstName} ${item.name}`}</Text>
      <Text style={styles.phone}>{item.phoneNumber}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditEmployee(item.id)} style={styles.actionButton}>
          <Text style={styles.actionText}>Éditer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteEmployeeById(item.id)} style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.actionText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const debouncedSearch = debounce((text: string) => setSearchQuery(text), 300);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Employés</Text>
      <TextInput
        placeholder="Rechercher un employé"
        onChangeText={debouncedSearch}
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEmployee')}
      >
        <Text style={styles.buttonText}>Ajouter un Employé</Text>
      </TouchableOpacity>
      <Animated.FlatList
        style={{ opacity: listOpacity }}
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  item: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  phone: {
    fontSize: 16,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmployeeListScreen;