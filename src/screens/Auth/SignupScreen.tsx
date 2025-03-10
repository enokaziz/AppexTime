import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { register } from '../../services/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Picker } from '@react-native-picker/picker';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const signupSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmation du mot de passe requise'),
  role: Yup.string().required('Rôle requis'),
});

const SignupScreen = ({ navigation }: { navigation: SignupScreenNavigationProp }) => {
  const [loading, setLoading] = useState(false);
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const formTranslateY = React.useRef(new Animated.Value(50)).current;
  const buttonOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignup = async (values: { email: string; password: string; confirmPassword: string; role: string }) => {
    setLoading(true);
    try {
      const { success, error } = await register(values.email, values.password, values.role);
      if (success) {
        Alert.alert('Succès', 'Inscription réussie. Veuillez vous connecter.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Échec', error || 'Veuillez vérifier vos informations.');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Inscription
      </Animated.Text>
      <Animated.View style={[styles.formContainer, { transform: [{ translateY: formTranslateY }] }]}>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '', role: 'user' }}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
              <Picker selectedValue={values.role} onValueChange={handleChange('role')} onBlur={handleBlur('role')}>
                <Picker.Item label="Utilisateur" value="user" />
                <Picker.Item label="Responsable" value="Responsable" />
              </Picker>
              {touched.role && errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
              <Animated.View style={{ opacity: buttonOpacity }}>
                <TouchableOpacity style={styles.button} onPress={() => handleSubmit()} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </Formik>
      </Animated.View>
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Retour à la connexion</Text>
      </TouchableOpacity>
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default SignupScreen;