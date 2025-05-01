import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import debounce from 'lodash/debounce';
import { globalStylesUpdated, colors } from '../../styles/globalStylesUpdated';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchEmployees, deleteEmployee } from '../../store/slices/employeeSlice';
import { ActivityIndicator } from 'react-native';
import { showToast } from '../../store/slices/uiSlice';

type EmployeeListScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'EmployeeList'>;
};

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  phone: string;
};

const EmployeeListScreen: React.FC<EmployeeListScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useAppSelector((state) => state.employee);
  const { user } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const listOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user?.companyId) {
      dispatch(fetchEmployees(user.companyId));
    }
  }, [dispatch, user?.companyId]);

  useEffect(() => {
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
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
              await dispatch(deleteEmployee(employeeId)).unwrap();
              dispatch(showToast({
                message: 'Employé supprimé avec succès',
                type: 'success'
              }));
            } catch (error) {
              dispatch(showToast({
                message: 'Erreur lors de la suppression de l\'employé',
                type: 'error'
              }));
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Employee }) => (
    <Animated.View style={[globalStylesUpdated.card, { opacity: listOpacity }]}>
      <View style={styles.employeeInfo}>
        <Text style={globalStylesUpdated.text}>{`${item.firstName} ${item.lastName}`}</Text>
        <Text style={[globalStylesUpdated.text, styles.employeeId]}>ID: {item.employeeId}</Text>
        <Text style={globalStylesUpdated.text}>{item.phone}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => handleEditEmployee(item.id)} 
          style={[globalStylesUpdated.actionButton, styles.editButton]}
        >
          <Text style={styles.actionText}>Éditer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDeleteEmployeeById(item.id)} 
          style={[globalStylesUpdated.actionButton, styles.deleteButton]}
        >
          <Text style={styles.actionText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const debouncedSearch = debounce((text: string) => setSearchQuery(text), 300);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={globalStylesUpdated.button}
          onPress={() => user?.companyId && dispatch(fetchEmployees(user.companyId))}
        >
          <Text style={globalStylesUpdated.buttonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStylesUpdated.container}>
      <Text style={globalStylesUpdated.title}>Liste des Employés</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Rechercher un employé"
          onChangeText={debouncedSearch}
          style={styles.searchInput}
          placeholderTextColor={colors.border}
        />
      </View>

      <TouchableOpacity
        style={[globalStylesUpdated.button, styles.addButton]}
        onPress={() => navigation.navigate('AddEmployee')}
      >
        <Text style={globalStylesUpdated.buttonText}>Ajouter un Employé</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: colors.background,
    color: colors.text,
  },
  listContainer: {
    paddingBottom: 20,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeId: {
    color: colors.secondary,
    fontSize: 14,
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: colors.primary,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  addButton: {
    marginBottom: 15,
  },
});

export default EmployeeListScreen;
