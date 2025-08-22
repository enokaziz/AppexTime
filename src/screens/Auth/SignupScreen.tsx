import React, { useEffect, useState, useCallback } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { theme } from '../../styles/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const StatusIcon = ({
  status,
}: {
  status: 'idle' | 'error' | 'success' | 'focused';
}) => {
  const iconMap: Record<typeof status, IconName> = {
    idle: 'person-circle-outline',
    error: 'close-circle-outline',
    success: 'checkmark-circle-outline',
    focused: 'pencil-outline',
  };
  const iconName = iconMap[status];

  const targetColor = {
    idle: '#BDBDBD',
    error: '#ef4444',
    success: '#4CAF50',
    focused: '#4CAF50',
  }[status];

  const colorAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false, // Color animation needs useNativeDriver: false
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [status]);

  const interpolatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#BDBDBD', targetColor], // Animate from a neutral color to the target color
  });

  return (
    <Animated.View style={{ alignItems: 'center', marginBottom: 16 }}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Animated.Text style={{ color: interpolatedColor }}>
          <Ionicons name={iconName} size={64} />
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

const signupSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmation du mot de passe requise'),
  role: Yup.string().required('Rôle requis'),
});

const SignupScreen = ({
  navigation,
}: {
  navigation: SignupScreenNavigationProp;
}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const logoScale = React.useRef(new Animated.Value(0.5)).current;
  const logoRotation = React.useRef(new Animated.Value(0)).current;
  const formTranslateY = React.useRef(new Animated.Value(50)).current;
  const buttonOpacity = React.useRef(new Animated.Value(0)).current;
  const buttonScale = React.useRef(new Animated.Value(1)).current;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState<
    null | 'email' | 'password' | 'confirmPassword' | 'role'
  >(null);

  const eyeIconRotation = React.useRef(new Animated.Value(0)).current;

  const handleSignup = useCallback(
    async (values: { email: string; password: string; role: string }) => {
      try {
        console.log("🚀 Début de l'inscription avec:", {
          email: values.email,
          role: values.role,
        });

        // Timeout de sécurité de 35 secondes
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () =>
              reject(new Error("Timeout: L'inscription a pris trop de temps")),
            35000,
          );
        });

        const registrationPromise = dispatch(registerUser(values));

        const resultAction = await Promise.race([
          registrationPromise,
          timeoutPromise,
        ]);

        if (registerUser.fulfilled.match(resultAction)) {
          console.log('✅ Inscription réussie');
          Alert.alert(
            'Succès',
            'Inscription réussie. Vous pouvez maintenant vous connecter.',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
          );
        } else if (registerUser.rejected.match(resultAction)) {
          console.log('❌ Inscription échouée:', resultAction.error);
          // L'erreur est déjà gérée par le state Redux
        }
      } catch (error) {
        console.error("💥 Erreur inattendue lors de l'inscription:", error);

        let errorMessage =
          "Une erreur inattendue s'est produite. Veuillez réessayer.";

        // Type guard pour vérifier si error a une propriété message
        if (error && typeof error === 'object' && 'message' in error) {
          const errorObj = error as { message: string };
          if (
            errorObj.message === "Timeout: L'inscription a pris trop de temps"
          ) {
            errorMessage =
              "L'inscription a pris trop de temps. Vérifiez votre connexion internet et réessayez.";
          }
        }

        Alert.alert('Erreur', errorMessage, [{ text: 'OK' }]);
      }
    },
    [dispatch, navigation],
  );

  const eyeIconInterpolate = eyeIconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Animations d'apparition
  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
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
            <Animated.View
              style={{
                transform: [
                  { scale: logoScale },
                  {
                    rotate: logoRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-10deg', '0deg'],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../../assets/Appextime.png')}
                  style={styles.logo}
                  resizeMode="contain"
                  accessibilityLabel="Logo ApexTime"
                />
              </View>
            </Animated.View>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez ApexTime</Text>
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
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
              role: 'employee',
            }}
            validationSchema={signupSchema}
            onSubmit={handleSignup}
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
                  <Ionicons name="mail-outline" size={24} color="#757575" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    onFocus={() => setFocusedInput('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Champ email"
                    testID="signup-email-input"
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <View
                  style={[
                    styles.inputWrapper,
                    focusedInput === 'password' ? styles.inputFocused : null,
                    touched.password && errors.password
                      ? styles.inputError
                      : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color="#757575"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    onFocus={() => setFocusedInput('password')}
                    secureTextEntry={!passwordVisible}
                    accessibilityLabel="Champ mot de passe"
                    testID="signup-password-input"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setPasswordVisible((v) => !v);
                      Animated.sequence([
                        Animated.timing(eyeIconRotation, {
                          toValue: 1,
                          duration: 200,
                          useNativeDriver: true,
                        }),
                        Animated.timing(eyeIconRotation, {
                          toValue: 0,
                          duration: 200,
                          useNativeDriver: true,
                        }),
                      ]).start();
                    }}
                    accessibilityLabel={
                      passwordVisible
                        ? 'Masquer le mot de passe'
                        : 'Afficher le mot de passe'
                    }
                    style={styles.eyeButton}
                  >
                    <Animated.View
                      style={{ transform: [{ rotate: eyeIconInterpolate }] }}
                    >
                      <Ionicons
                        name={
                          passwordVisible ? 'eye-off-outline' : 'eye-outline'
                        }
                        size={24}
                        color="#757575"
                      />
                    </Animated.View>
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <View
                  style={[
                    styles.inputWrapper,
                    focusedInput === 'confirmPassword'
                      ? styles.inputFocused
                      : null,
                    touched.confirmPassword && errors.confirmPassword
                      ? styles.inputError
                      : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color="#757575"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    onFocus={() => setFocusedInput('confirmPassword')}
                    secureTextEntry={!confirmPasswordVisible}
                    accessibilityLabel="Champ confirmation mot de passe"
                    testID="signup-confirm-password-input"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setConfirmPasswordVisible((v) => !v);
                      Animated.sequence([
                        Animated.timing(eyeIconRotation, {
                          toValue: 1,
                          duration: 200,
                          useNativeDriver: true,
                        }),
                        Animated.timing(eyeIconRotation, {
                          toValue: 0,
                          duration: 200,
                          useNativeDriver: true,
                        }),
                      ]).start();
                    }}
                    accessibilityLabel={
                      confirmPasswordVisible
                        ? 'Masquer la confirmation'
                        : 'Afficher la confirmation'
                    }
                    style={styles.eyeButton}
                  >
                    <Animated.View
                      style={{ transform: [{ rotate: eyeIconInterpolate }] }}
                    >
                      <Ionicons
                        name={
                          confirmPasswordVisible
                            ? 'eye-off-outline'
                            : 'eye-outline'
                        }
                        size={24}
                        color="#757575"
                      />
                    </Animated.View>
                  </TouchableOpacity>
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                <View
                  style={[
                    styles.pickerWrapper,
                    focusedInput === 'role' ? styles.inputFocused : null,
                  ]}
                >
                  <Ionicons name="person-outline" size={24} color="#757575" />
                  <Picker
                    selectedValue={values.role}
                    onValueChange={handleChange('role')}
                    onBlur={handleBlur('role')}
                    onFocus={() => setFocusedInput('role')}
                    style={styles.picker}
                  >
                    <Picker.Item label="Utilisateur" value="employee" />
                    <Picker.Item label="Responsable" value="manager" />
                  </Picker>
                </View>
                {touched.role && errors.role && (
                  <Text style={styles.errorText}>{errors.role}</Text>
                )}

                {error && (
                  <View style={styles.errorContainer}>
                    <Ionicons
                      name="alert-circle"
                      size={20}
                      color={theme.colors.error}
                    />
                    <Text style={styles.apiErrorText}>{error}</Text>
                  </View>
                )}

                <StatusIcon
                  status={focusedInput ? 'focused' : error ? 'error' : 'idle'}
                />

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
                    accessibilityLabel="Bouton s'inscrire"
                    testID="signup-submit-button"
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Ionicons
                          name="person-add-outline"
                          size={24}
                          color="#fff"
                        />
                        <Text style={styles.buttonText}>S'inscrire</Text>
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
            <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerDecor: {
    position: 'absolute',
    top: -150,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#C8E6C9', // A slightly darker shade of green
    opacity: 0.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B5E20', // A darker green for better contrast
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#388E3C', // A medium green
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#BDBDBD',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#BDBDBD',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#212121',
  },
  picker: {
    flex: 1,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  apiErrorText: {
    color: theme.colors.error,
    marginBottom: 0,
    marginLeft: theme.spacing.sm,
    textAlign: 'left',
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationButtonsContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#388E3C',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SignupScreen;
