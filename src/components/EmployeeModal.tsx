import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useEmployee from '@hooks/useEmployee';
import { Employee } from '../types/index';
import { useToast } from '../hooks/useToast';

/**
 * Schéma de validation pour le formulaire d'employé
 */
const EmployeeSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères')
    .required('Le nom est requis'),
  firstName: Yup.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne doit pas dépasser 50 caractères')
    .required('Le prénom est requis'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Le numéro de téléphone doit contenir 10 chiffres')
    .required('Le numéro de téléphone est requis'),
  companyInitials: Yup.string()
    .min(2, 'Les initiales doivent contenir au moins 2 caractères')
    .max(5, 'Les initiales ne doivent pas dépasser 5 caractères')
    .required('Les initiales sont requises'),
});

interface EmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  employeeId?: string;
}

/**
 * Modal pour ajouter ou modifier un employé
 * @param visible - État de visibilité du modal
 * @param onClose - Fonction de fermeture du modal
 * @param employeeId - ID de l'employé à modifier (optionnel)
 */
const EmployeeModal: React.FC<EmployeeModalProps> = React.memo(
  ({ visible, onClose, employeeId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { handleAddEmployee, handleUpdateEmployee, handleGetEmployee } =
      useEmployee();

    const initialValues = {
      name: '',
      firstName: '',
      phoneNumber: '',
      photo: '',
      companyInitials: '',
    };

    useEffect(() => {
      if (employeeId) {
        const fetchEmployee = async () => {
          try {
            const employee = await handleGetEmployee(employeeId);
            if (employee) {
              initialValues.name = employee.name;
              initialValues.firstName = employee.firstName;
              initialValues.phoneNumber = employee.phoneNumber;
              initialValues.photo = employee.photo;
              initialValues.companyInitials = employee.companyInitials;
            }
          } catch (error) {
            toast.error('Erreur lors du chargement des données');
          }
        };
        fetchEmployee();
      }
    }, [employeeId]);

    const handleSubmit = async (values: typeof initialValues) => {
      setIsLoading(true);
      try {
        if (employeeId) {
          await handleUpdateEmployee({
            id: employeeId,
            ...values,
            qrCodeUrl: '',
            uniqueId: `EMP-${Date.now()}`,
          });
          toast.success('Employé mis à jour avec succès');
        } else {
          await handleAddEmployee(
            values.name,
            values.firstName,
            values.phoneNumber,
            values.photo,
            values.companyInitials,
            '',
            `EMP-${Date.now()}`,
          );
          toast.success('Employé ajouté avec succès');
        }
        onClose();
      } catch (error) {
        toast.error('Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              {employeeId ? 'Modifier un employé' : 'Ajouter un employé'}
            </Text>
            <Formik
              initialValues={initialValues}
              validationSchema={EmployeeSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <TextInput
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder="Nom"
                    style={[
                      styles.input,
                      touched.name && errors.name && styles.inputError,
                    ]}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}

                  <TextInput
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    placeholder="Prénom"
                    style={[
                      styles.input,
                      touched.firstName &&
                        errors.firstName &&
                        styles.inputError,
                    ]}
                  />
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}

                  <TextInput
                    value={values.phoneNumber}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    placeholder="Numéro de téléphone"
                    keyboardType="phone-pad"
                    style={[
                      styles.input,
                      touched.phoneNumber &&
                        errors.phoneNumber &&
                        styles.inputError,
                    ]}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  )}

                  <TextInput
                    value={values.companyInitials}
                    onChangeText={handleChange('companyInitials')}
                    onBlur={handleBlur('companyInitials')}
                    placeholder="Initiales de l'entreprise"
                    style={[
                      styles.input,
                      touched.companyInitials &&
                        errors.companyInitials &&
                        styles.inputError,
                    ]}
                  />
                  {touched.companyInitials && errors.companyInitials && (
                    <Text style={styles.errorText}>
                      {errors.companyInitials}
                    </Text>
                  )}

                  <View style={styles.buttonContainer}>
                    {isLoading ? (
                      <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                      <>
                        <Button
                          title="Enregistrer"
                          onPress={() => handleSubmit()}
                        />
                        <Button
                          title="Annuler"
                          onPress={onClose}
                          color="#ff0000"
                        />
                      </>
                    )}
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    );
  },
);

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
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default EmployeeModal;
