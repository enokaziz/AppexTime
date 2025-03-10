import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';

const FaceRecognitionScreen: React.FC = () => {
  const handleFaceRecognition = (faces: any[]) => {
    if (faces.length > 0) {
      console.log('Visage détecté:', faces[0]);
    } else {
      console.log('Aucun visage détecté.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Face Recognition Screen</Text>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.front}
        onFacesDetected={({ faces }) => handleFaceRecognition(faces)}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
      />
      <Button title="Démarrer la reconnaissance faciale" onPress={() => handleFaceRecognition([])} />
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

export default FaceRecognitionScreen;

