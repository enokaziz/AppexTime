import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useToast } from '../hooks/useToast';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/globalStylesUpdated';

interface PhotoPickerProps {
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({ photoUri, setPhotoUri }) => {
  const toast = useToast();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      toast.error('Permission d\'accès à la galerie refusée');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      toast.error('Permission d\'accès à la caméra refusée');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.photoContainer}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>Photo</Text>
        </View>
      )}
      <View style={styles.photoButtons}>
        <TouchableOpacity
          style={[styles.photoButton, { marginRight: 10 }]}
          onPress={takePhoto}
        >
          <Ionicons name="camera" size={24} color={colors.white} />
          <Text style={styles.buttonText}>Prendre Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={pickImage}
        >
          <Ionicons name="image" size={24} color={colors.white} />
          <Text style={styles.buttonText}>Galerie</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: colors.text,
    fontSize: 16,
  },
  photoButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
    marginLeft: 5,
  },
});

export default PhotoPicker;
