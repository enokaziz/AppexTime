import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Employee, BadgeDesign, BadgeFormat } from '../../types/index';
import QRCode from 'react-native-qrcode-svg';
import { generateBadge } from '../../utils/generateBadge';
import { Picker } from '@react-native-picker/picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type GenerateBadgeScreenProps = {
  route: RouteProp<{ params: { employee: Employee } }, 'params'>;
  navigation: StackNavigationProp<AuthStackParamList, 'GenerateBadge'>;
};

const GenerateBadgeScreen: React.FC<GenerateBadgeScreenProps> = ({
  route,
  navigation,
}) => {
  const { employee } = route.params;
  const [loading, setLoading] = useState(false);
  const [design, setDesign] = useState<BadgeDesign>({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 10,
    fontFamily: 'System',
    fontSize: 16,
  });
  const [format, setFormat] = useState<BadgeFormat>('PDF');
  const [preview, setPreview] = useState<string | null>(null);

  const validateData = () => {
    if (!employee.name || !employee.firstName) {
      Alert.alert('Erreur', 'Le nom et le prénom sont requis');
      return false;
    }
    if (!employee.phoneNumber) {
      Alert.alert('Erreur', 'Le numéro de téléphone est requis');
      return false;
    }
    return true;
  };

  const generatePreview = async () => {
    if (!validateData()) return;

    try {
      const badgeData = {
        employeeId: employee.id,
        name: employee.name,
        firstName: employee.firstName,
        companyInitials: employee.companyInitials,
        timestamp: new Date().toISOString(),
      };

      const qrCode = await new Promise<string>((resolve) => {
        const qr = new QRCode({
          value: JSON.stringify(badgeData),
          size: 150,
          color: design.textColor,
          backgroundColor: design.backgroundColor,
        });
        qr.toDataURL((dataUrl: string) => resolve(dataUrl));
      });

      setPreview(qrCode);
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Erreur lors de la génération de la prévisualisation',
      );
    }
  };

  const handleGenerateBadge = async () => {
    if (!validateData()) return;
    setLoading(true);

    try {
      const badgeData = {
        employeeId: employee.id,
        name: employee.name,
        firstName: employee.firstName,
        companyInitials: employee.companyInitials,
        timestamp: new Date().toISOString(),
      };

      const badge = await generateBadge({
        ...employee,
        qrCodeUrl: JSON.stringify(badgeData),
        design,
        format,
      });

      if (format === 'PDF') {
        await Print.printAsync({
          uri: badge,
        });
      } else {
        await Sharing.shareAsync(badge);
      }

      Alert.alert('Succès', 'Badge généré avec succès', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.message || 'Erreur lors de la génération du badge',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Générer un Badge</Text>

      <View style={styles.previewContainer}>
        <Text style={styles.sectionTitle}>Prévisualisation</Text>
        {preview ? (
          <Image source={{ uri: preview }} style={styles.preview} />
        ) : (
          <TouchableOpacity
            style={styles.generatePreviewButton}
            onPress={generatePreview}
          >
            <Text style={styles.buttonText}>Générer Prévisualisation</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.designContainer}>
        <Text style={styles.sectionTitle}>Personnalisation</Text>

        <View style={styles.colorPicker}>
          <Text>Couleur de fond</Text>
          <TouchableOpacity
            style={[
              styles.colorButton,
              { backgroundColor: design.backgroundColor },
            ]}
            onPress={() => {
              // Ici, vous pouvez ajouter un color picker
            }}
          />
        </View>

        <View style={styles.colorPicker}>
          <Text>Couleur du texte</Text>
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: design.textColor }]}
            onPress={() => {
              // Ici, vous pouvez ajouter un color picker
            }}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Text>Format du badge</Text>
          <Picker
            selectedValue={format}
            onValueChange={(value) => setFormat(value as BadgeFormat)}
          >
            <Picker.Item label="PDF" value="PDF" />
            <Picker.Item label="PNG" value="PNG" />
            <Picker.Item label="SVG" value="SVG" />
            <Picker.Item label="JPG" value="JPG" />
          </Picker>
        </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  previewContainer: {
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
  preview: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  designContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  generatePreviewButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
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
