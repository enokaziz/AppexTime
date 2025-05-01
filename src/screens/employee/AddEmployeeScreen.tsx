import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Image,
  ScrollView,
  Animated,
  StyleSheet
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { globalStylesUpdated, colors } from '../../styles/globalStylesUpdated';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { RootState } from '../../store/store';
import { addEmployee } from '../../store/slices/employeeSlice';
import { useToast } from '../../hooks/useToast';
import { generateUniqueId } from '../../utils/helpers';
import PhotoPicker from '../../components/PhotoPicker';

type AddEmployeeScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'AddEmployee'>;
};

interface PhotoData {
  uri: string;
  type: string;
  name: string;
}

const addEmployeeSchema = Yup.object().shape({
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

const AddEmployeeScreen: React.FC<AddEmployeeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user, role } = useAppSelector((state: RootState) => state.auth);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const formTranslateY = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    if (role !== 'admin') {
      toast.error('Vous n\'avez pas les permissions nécessaires');
      navigation.goBack();
      return;
    }

    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, [role]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={globalStylesUpdated.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.Text 
          style={[
            globalStylesUpdated.title, 
            { opacity: titleOpacity }
          ]}
        >
          Ajouter un Employé
        </Animated.Text>

        <Animated.View 
          style={[
            styles.formContainer, 
            { transform: [{ translateY: formTranslateY }] }
          ]}
        >
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              phone: '',
            }}
            validationSchema={addEmployeeSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                if (!photoUri) {
                  toast.error('Veuillez ajouter une photo');
                  return;
                }

                if (!user?.companyId) {
                  toast.error('Erreur: ID de l\'entreprise non trouvé');
                  return;
                }

                const employeeId = generateUniqueId('EMP');
                
                await dispatch(addEmployee({
                  employeeData: {
                    ...values,
                    employeeId,
                    companyId: user.companyId,
                  },
                  photoData: {
                    uri: photoUri,
                    type: 'image/jpeg',
                    name: `${employeeId}_photo.jpg`
                  }
                })).unwrap();

                toast.success('Employé ajouté avec succès');
                resetForm();
                setPhotoUri(null);
                navigation.goBack();
              } catch (error) {
                toast.error('Erreur lors de l\'ajout de l\'employé');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View>
                <PhotoPicker photoUri={photoUri} setPhotoUri={setPhotoUri} />

                <TextInput
                  style={[
                    globalStylesUpdated.input,
                    touched.firstName && errors.firstName && styles.inputError
                  ]}
                  placeholder="Prénom"
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                />
                {touched.firstName && errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}

                <TextInput
                  style={[
                    globalStylesUpdated.input,
                    touched.lastName && errors.lastName && styles.inputError
                  ]}
                  placeholder="Nom"
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                />
                {touched.lastName && errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}

                <TextInput
                  style={[
                    globalStylesUpdated.input,
                    touched.phone && errors.phone && styles.inputError
                  ]}
                  placeholder="Numéro de Téléphone"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  keyboardType="phone-pad"
                />
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}

                <TouchableOpacity
                  style={[
                    globalStylesUpdated.button,
                    styles.submitButton,
                    isSubmitting && styles.buttonDisabled
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={globalStylesUpdated.buttonText}>Ajouter l'employé</Text>
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
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default AddEmployeeScreen;
