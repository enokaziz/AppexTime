import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { globalStylesUpdated, colors } from '../../styles/globalStylesUpdated';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { updateEmployee } from '../../store/slices/employeeSlice';
import { useToast } from '../../hooks/useToast';
import { RootState } from '../../store/store';
import { Employee, PhotoData } from '../../types/employee';
import PhotoPicker from '../../components/PhotoPicker';
import * as ImagePicker from 'expo-image-picker';

type EditEmployeeScreenProps = {
  route: RouteProp<AuthStackParamList, 'EditEmployee'>;
  navigation: StackNavigationProp<AuthStackParamList, 'EditEmployee'>;
};

type FormValues = {
  firstName: string;
  lastName: string;
  phone: string;
};

const editEmployeeSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Trop court')
    .max(50, 'Trop long')
    .required('Prénom requis'),
  lastName: Yup.string()
    .min(2, 'Trop court')
    .max(50, 'Trop long')
    .required('Nom requis'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Numéro de téléphone invalide (10 chiffres requis)')
    .required('Numéro requis'),
});

const EditEmployeeScreen: React.FC<EditEmployeeScreenProps> = ({
  route,
  navigation,
}) => {
  const employeeId: string = route.params.employeeId || '';
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { employees, loading } = useAppSelector(
    (state: RootState) => state.employee,
  );
  const { role } = useAppSelector((state: RootState) => state.auth);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const formTranslateY = React.useRef(new Animated.Value(50)).current;

  const employee = employees.find((emp: Employee) => emp.id === employeeId);

  useEffect(() => {
    if (role !== 'admin') {
      toast.error('Vous n\'avez pas les permissions nécessaires');
      navigation.goBack();
      return;
    }

    if (!employee) {
      toast.error('Employé non trouvé');
      navigation.goBack();
      return;
    }

    setPhotoUri(employee.photoUrl || null);

    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [employee, navigation, role]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      toast.error("Permission d'accès à la galerie refusée");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      toast.error("Permission d'accès à la caméra refusée");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  if (loading || !employee) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStylesUpdated.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.Text
          style={[globalStylesUpdated.title, { opacity: titleOpacity }]}
        >
          Modifier l'Employé
        </Animated.Text>

        <Animated.View
          style={[
            styles.formContainer,
            { transform: [{ translateY: formTranslateY }] },
          ]}
        >
          <Formik<FormValues>
            initialValues={{
              firstName: employee.firstName || '',
              lastName: employee.lastName || '',
              phone: employee.phone || '',
            }}
            validationSchema={editEmployeeSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                if (!photoUri) {
                  toast.error('Veuillez ajouter une photo');
                  return;
                }

                const photoData: PhotoData | undefined =
                  photoUri !== employee.photoUrl
                    ? {
                        uri: photoUri,
                        type: 'image/jpeg',
                        name: `${employeeId}_photo_updated.jpg`,
                      }
                    : undefined;

                await dispatch(
                  updateEmployee({
                    id: employeeId,
                    employeeData: values,
                    photoData,
                  }),
                ).unwrap();

                toast.success('Employé mis à jour avec succès');
                navigation.goBack();
              } catch (error) {
                toast.error("Erreur lors de la mise à jour de l'employé");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View>
                <PhotoPicker photoUri={photoUri} setPhotoUri={setPhotoUri} />

                <TextInput
                  style={[
                    globalStylesUpdated.input,
                    touched.firstName && errors.firstName && styles.inputError,
                  ]}
                  placeholder="Prénom"
                  value={values.firstName || ''}
                  onChangeText={(text: string) => handleChange('firstName')(text)}
                  onBlur={(event: any) => handleBlur('firstName')(event)}
                />
                {touched.firstName && errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}

                <TextInput
                  style={[
                    globalStylesUpdated.input,
                    touched.lastName && errors.lastName && styles.inputError,
                  ]}
                  placeholder="Nom"
                  value={values.lastName || ''}
                  onChangeText={(text: string) => handleChange('lastName')(text)}
                  onBlur={(event: any) => handleBlur('lastName')(event)}
                />
                {touched.lastName && errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}

                <TextInput
                  style={[
                    globalStylesUpdated.input,
                    touched.phone && errors.phone && styles.inputError,
                  ]}
                  placeholder="Numéro de Téléphone"
                  value={values.phone || ''}
                  onChangeText={(text: string) => handleChange('phone')(text)}
                  onBlur={(event: any) => handleBlur('phone')(event)}
                  keyboardType="phone-pad"
                />
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}

                <TouchableOpacity
                  style={[
                    globalStylesUpdated.button,
                    styles.submitButton,
                    isSubmitting && styles.buttonDisabled,
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={globalStylesUpdated.buttonText}>
                      Mettre à jour
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default EditEmployeeScreen;
