import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const QRScannerScreen: React.FC = () => {
  const handleQRCodeRead = (e: any) => {
    console.log('QR Code détecté:', e.data);
    // Logique pour traiter le QR code
  };

  return (
    <View style={styles.container}>
      <Text>QR Scanner Screen</Text>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={handleQRCodeRead}
        captureAudio={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
});

export default QRScannerScreen;

