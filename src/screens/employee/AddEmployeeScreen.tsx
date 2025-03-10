import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { generateUniqueId, generateQRCode } from '../../utils/helpers';
import { addEmployee } from '@services/employee';

type AddEmployeeScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'AddEmployee'>;
};

const addEmployeeSchema = Yup.object().shape({
  name: Yup.string().required('Nom requis'),
  firstName: Yup.string().required('Prénom requis'),
  phoneNumber: Yup.string().matches(/^\d{10}$/, 'Numéro de téléphone invalide (10 chiffres requis)').required('Numéro requis'),
  photo: Yup.string().url('URL invalide').required('Photo requise'),
});

const AddEmployeeScreen = ({ navigation }: AddEmployeeScreenProps) => {
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const formTranslateY = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(formTranslateY, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Ajouter un Employé
      </Animated.Text>
      <Animated.View style={[styles.formContainer, { transform: [{ translateY: formTranslateY }] }]}>
        <Formik
          initialValues={{ name: '', firstName: '', phoneNumber: '', photo: '' }}
          validationSchema={addEmployeeSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const uniqueId = generateUniqueId('emp');
              const qrCodeUrl = await generateQRCode(uniqueId);
              // TODO: Implémenter addEmployee
               await addEmployee({
                 ...values, uniqueId, qrCodeUrl,
                 id: '',
                 companyInitials: ''
               });
              Alert.alert('Succès', 'Employé ajouté avec succès !');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout.');
              console.error(error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View>
              <TextInput
                style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
                placeholder="Nom"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              <TextInput
                style={[styles.input, touched.firstName && errors.firstName ? styles.inputError : null]}
                placeholder="Prénom"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
              />
              {touched.firstName && errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
              <TextInput
                style={[styles.input, touched.phoneNumber && errors.phoneNumber ? styles.inputError : null]}
                placeholder="Numéro de Téléphone"
                value={values.phoneNumber}
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                keyboardType="phone-pad"
              />
              {touched.phoneNumber && errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
              <TextInput
                style={[styles.input, touched.photo && errors.photo ? styles.inputError : null]}
                placeholder="Photo (URL)"
                value={values.photo}
                onChangeText={handleChange('photo')}
                onBlur={handleBlur('photo')}
              />
              {touched.photo && errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}
              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ajouter</Text>}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formContainer: {
    width: '100%',
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
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEmployeeScreen;