import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Vibration,
  Dimensions,
} from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { checkIn } from '../store/slices/attendanceSlice';
import { useAuth } from '../contexts/AuthContext';
import { CustomUser } from '../types/auth';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { ScanHistory } from '../types';
import * as Location from 'expo-location';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7;

const QRScanner: React.FC = () => {
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(
    null,
  );
  const [scanned, setScanned] = React.useState(false);
  const [isFlashOn, setIsFlashOn] = React.useState(false);
  const [scanHistory, setScanHistory] = React.useState<ScanHistory[]>([]);
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  React.useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await BarCodeScanner.requestPermissionsAsync();
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    if (scanned) return;
    setScanned(true);
    Vibration.vibrate(200);

    try {
      // Vérifier si c'est un badge valide
      const badgeData = JSON.parse(data);
      if (!badgeData.employeeId) {
        Alert.alert('Erreur', 'Badge invalide');
        return;
      }

      // Vérifier si l'utilisateur a un companyId
      const customUser = user as CustomUser;
      if (!customUser?.companyId) {
        Alert.alert('Erreur', "ID de l'entreprise non trouvé");
        return;
      }

      // Obtenir la position actuelle
      const location = await Location.getCurrentPositionAsync({});

      // Enregistrer le pointage
      await dispatch(
        checkIn({
          employeeId: badgeData.employeeId,
          companyId: customUser.companyId,
          verificationMethod: 'qr',
        }),
      ).unwrap();

      // Ajouter à l'historique
      const newScan: ScanHistory = {
        id: Date.now().toString(),
        employeeId: badgeData.employeeId,
        timestamp: new Date().toISOString(),
        status: 'success',
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };
      setScanHistory((prev) => [newScan, ...prev].slice(0, 10));

      Alert.alert('Succès', 'Pointage enregistré avec succès', [
        {
          text: 'OK',
          onPress: () => setScanned(false),
        },
      ]);
    } catch (error: any) {
      const newScan: ScanHistory = {
        id: Date.now().toString(),
        employeeId: '',
        timestamp: new Date().toISOString(),
        status: 'error',
        errorMessage: error.message,
      };
      setScanHistory((prev) => [newScan, ...prev].slice(0, 10));

      Alert.alert('Erreur', error.message || 'Erreur lors du pointage', [
        {
          text: 'OK',
          onPress: () => setScanned(false),
        },
      ]);
    }
  };

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
  };

  if (hasPermission === null) {
    return <Text>Demande d'accès à la caméra en cours...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Accès à la caméra refusé</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <View style={styles.scanAreaCorner} />
          <View style={[styles.scanAreaCorner, styles.topRight]} />
          <View style={[styles.scanAreaCorner, styles.bottomLeft]} />
          <View style={[styles.scanAreaCorner, styles.bottomRight]} />
        </View>
      </View>
      <View style={styles.controls}>
        <Button
          title={isFlashOn ? 'Flash Off' : 'Flash On'}
          onPress={toggleFlash}
        />
        {scanned && (
          <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />
        )}
      </View>
      {scanHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Historique des scans</Text>
          {scanHistory.map((scan) => (
            <View key={scan.id} style={styles.historyItem}>
              <Text style={styles.historyText}>
                {new Date(scan.timestamp).toLocaleTimeString()} -{' '}
                {scan.status === 'success' ? 'Succès' : 'Erreur'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scanAreaCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  historyContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 10,
    maxHeight: 200,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 14,
  },
});

export default QRScanner;
