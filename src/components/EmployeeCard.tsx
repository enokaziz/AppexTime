import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useImageCache } from '../hooks/useImageCache';
import { Employee } from '../types';
import { colors } from '../styles/globalStylesUpdated';

interface EmployeeCardProps {
  employee: Employee;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: any;
}

/**
 * Composant de carte pour afficher les informations d'un employé
 * @param employee - Données de l'employé
 * @param onPress - Fonction appelée lors du clic sur la carte
 * @param onLongPress - Fonction appelée lors d'un appui long sur la carte
 * @param style - Styles additionnels pour la carte
 */
const EmployeeCard: React.FC<EmployeeCardProps> = React.memo(
  ({ employee, onPress, onLongPress, style }) => {
    const { isLoading, error, cachedImage } = useImageCache(employee.photo);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.container,
            style,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.imageContainer}>
            {isLoading ? (
              <View style={styles.placeholder} />
            ) : error ? (
              <View style={[styles.placeholder, styles.errorPlaceholder]}>
                <Text style={styles.errorText}>!</Text>
              </View>
            ) : (
              <Animated.Image
                source={{ uri: cachedImage || employee.photo }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text
              style={styles.name}
            >{`${employee.firstName} ${employee.name}`}</Text>
            <Text style={styles.phone}>{employee.phoneNumber}</Text>
            <Text style={styles.initials}>{employee.companyInitials}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorPlaceholder: {
    backgroundColor: colors.error,
  },
  errorText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  initials: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default EmployeeCard;
