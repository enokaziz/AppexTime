import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Employee } from '../../types/index';
import QRCode from 'react-native-qrcode-svg';

type GenerateBadgeScreenProps = {
  route: RouteProp<{ params: { employee: Employee } }, 'params'>;
  navigation: StackNavigationProp<AuthStackParamList, 'GenerateBadge'>;
};

const GenerateBadgeScreen: React.FC<GenerateBadgeScreenProps> = ({ route }) => {
  const { employee } = route.params;
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateBadge = async () => {
    setLoading(true);
    try {
      // Simule la génération du QR code (remplacez par votre logique réelle si nécessaire)
      const generatedUrl = `https://example.com/qr/${employee.id}`;
      setQrCodeUrl(generatedUrl);
    } catch (error) {
      console.error('Erreur lors de la génération du badge:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Générer un Badge</Text>
      <View style={styles.badgeContainer}>
        <Text style={styles.name}>{`${employee.firstName} ${employee.name}`}</Text>
        <Text style={styles.phone}>{employee.phoneNumber}</Text>
        {qrCodeUrl && (
          <QRCode
            value={qrCodeUrl}
            size={150}
            color="#000"
            backgroundColor="#fff"
          />
        )}
      </View>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGenerateBadge}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Générer Badge</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  badgeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  phone: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
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

export default GenerateBadgeScreen;