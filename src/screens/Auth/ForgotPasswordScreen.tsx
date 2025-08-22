import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetPassword, clearError } from '../../store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Email requis'),
});

const ForgotPasswordScreen = ({
  navigation,
}: {
  navigation: ForgotPasswordScreenNavigationProp;
}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const formTranslateY = React.useRef(new Animated.Value(50)).current;
  const buttonOpacity = React.useRef(new Animated.Value(0)).current;
  const buttonScale = React.useRef(new Animated.Value(1)).current;
  const [focusedInput, setFocusedInput] = useState<null | 'email'>(null);

  useEffect(() => {
    dispatch(clearError());

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

    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleResetPassword = async (values: { email: string }) => {
    const resultAction = await dispatch(resetPassword(values.email));
    if (resetPassword.fulfilled.match(resultAction)) {
      Alert.alert(
        'Succès',
        'Un lien de réinitialisation a été envoyé à votre email.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerDecor} />

        <View style={styles.header}>
          <Animated.View style={{ opacity: titleOpacity }}>
            <Image
              source={require('../../../assets/Appextime.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo ApexTime"
            />
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.subtitle}>
              Entrez votre email pour réinitialiser
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.card,
            styles.formContainer,
            { transform: [{ translateY: formTranslateY }] },
          ]}
        >
          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleResetPassword}
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
                <View
                  style={[
                    styles.inputWrapper,
                    focusedInput === 'email' ? styles.inputFocused : null,
                    touched.email && errors.email ? styles.inputError : null,
                  ]}
                >
                  <Ionicons name="mail-outline" size={20} color="#6b7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={values.email}
                    onChangeText={(text) => {
                      handleChange('email')(text);
                      if (error) dispatch(clearError());
                    }}
                    onBlur={handleBlur('email')}
                    onFocus={() => setFocusedInput('email')}
                    onEndEditing={() => setFocusedInput(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Champ email"
                    testID="forgot-password-email-input"
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                {error && <Text style={styles.apiErrorText}>{error}</Text>}

                <Animated.View
                  style={{
                    opacity: buttonOpacity,
                    transform: [{ scale: buttonScale }],
                  }}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPressIn={() =>
                      Animated.spring(buttonScale, {
                        toValue: 0.98,
                        useNativeDriver: true,
                      }).start()
                    }
                    onPressOut={() =>
                      Animated.spring(buttonScale, {
                        toValue: 1,
                        friction: 3,
                        useNativeDriver: true,
                      }).start()
                    }
                    onPress={() => handleSubmit()}
                    disabled={loading}
                    accessibilityLabel="Bouton réinitialiser le mot de passe"
                    testID="forgot-password-submit-button"
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Ionicons
                          name="mail-open-outline"
                          size={20}
                          color="#fff"
                        />
                        <Text style={styles.buttonText}>Réinitialiser</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </Formik>
        </Animated.View>

        <View style={styles.navigationButtonsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0fdf4', // vert très clair
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerDecor: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#86efac', // vert 300
    opacity: 0.35,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#14532d',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
    color: '#166534',
  },
  formContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  inputWrapper: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  apiErrorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  navigationButtonsContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#16a34a',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
