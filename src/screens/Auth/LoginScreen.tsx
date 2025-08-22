import React, { useEffect, useState, useCallback } from 'react';
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
  Image,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

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
        useNativeDriver: false,
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
    outputRange: ['#BDBDBD', targetColor],
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

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe requis'),
});

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const formTranslateY = React.useRef(new Animated.Value(50)).current;
  const buttonOpacity = React.useRef(new Animated.Value(0)).current;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const buttonScale = React.useRef(new Animated.Value(1)).current;
  const [focusedInput, setFocusedInput] = useState<null | 'email' | 'password'>(
    null,
  );

  // Animations pour les nouveaux effets
  const emailUnderlineWidth = React.useRef(new Animated.Value(0)).current;
  const passwordUnderlineWidth = React.useRef(new Animated.Value(0)).current;
  const lockIconRotation = React.useRef(new Animated.Value(0)).current;
  const spinnerRotation = React.useRef(new Animated.Value(0)).current;
  const mascotScale = React.useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinnerRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinnerRotation.setValue(0);
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(mascotScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(mascotScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  const handleLogin = (values: { email: string; password: string }) => {
    dispatch(loginUser(values));
  };

  const handleInputFocus = useCallback(
    (inputType: 'email' | 'password') => {
      setFocusedInput(inputType);
      const underlineWidth =
        inputType === 'email' ? emailUnderlineWidth : passwordUnderlineWidth;
      Animated.timing(underlineWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    },
    [emailUnderlineWidth, passwordUnderlineWidth],
  );

  const handleInputBlur = useCallback(
    (inputType: 'email' | 'password') => {
      setFocusedInput(null);
      const underlineWidth =
        inputType === 'email' ? emailUnderlineWidth : passwordUnderlineWidth;
      Animated.timing(underlineWidth, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    },
    [emailUnderlineWidth, passwordUnderlineWidth],
  );

  const handlePasswordToggle = useCallback(() => {
    setPasswordVisible((v) => !v);
    Animated.sequence([
      Animated.timing(lockIconRotation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(lockIconRotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [lockIconRotation]);

  const spinnerInterpolate = spinnerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const lockIconInterpolate = lockIconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

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
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
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
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
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
                    onFocus={() => handleInputFocus('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Champ email"
                    testID="login-email-input"
                  />
                </View>
                <Animated.View
                  style={[
                    styles.underline,
                    {
                      width: emailUnderlineWidth.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
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
                  <Animated.View
                    style={{
                      transform: [{ rotate: lockIconInterpolate }],
                    }}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={24}
                      color="#757575"
                    />
                  </Animated.View>
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    onFocus={() => handleInputFocus('password')}
                    secureTextEntry={!passwordVisible}
                    accessibilityLabel="Champ mot de passe"
                    testID="login-password-input"
                  />
                  <TouchableOpacity
                    onPress={handlePasswordToggle}
                    accessibilityLabel={
                      passwordVisible
                        ? 'Masquer le mot de passe'
                        : 'Afficher le mot de passe'
                    }
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color="#757575"
                    />
                  </TouchableOpacity>
                </View>
                <Animated.View
                  style={[
                    styles.underline,
                    {
                      width: passwordUnderlineWidth.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {error && <Text style={styles.apiErrorText}>{error}</Text>}

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
                        toValue: 0.95,
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
                    accessibilityLabel="Bouton se connecter"
                    testID="login-submit-button"
                  >
                    {loading ? (
                      <View style={styles.spinnerContainer}>
                        <Animated.Image
                          source={require('../../../assets/Appextime.png')}
                          style={[
                            styles.spinnerLogo,
                            {
                              transform: [{ rotate: spinnerInterpolate }],
                            },
                          ]}
                        />
                      </View>
                    ) : (
                      <View style={styles.buttonContent}>
                        <Ionicons
                          name="log-in-outline"
                          size={24}
                          color="#fff"
                        />
                        <Text style={styles.buttonText}>Se connecter</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </Formik>
        </Animated.View>

        <View style={styles.navigationButtonsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Pas de compte ? S'inscrire</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.linkText}>Mot de passe oublié</Text>
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
    backgroundColor: '#E8F5E9',
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
    backgroundColor: '#C8E6C9',
    opacity: 0.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B5E20',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#388E3C',
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
  inputError: {
    borderColor: '#ef4444',
  },
  underline: {
    height: 2,
    backgroundColor: '#16a34a',
    marginBottom: 12,
    borderRadius: 1,
  },
  eyeButton: {
    padding: 4,
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
  mascotContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerLogo: {
    width: 24,
    height: 24,
  },
});

export default LoginScreen;
