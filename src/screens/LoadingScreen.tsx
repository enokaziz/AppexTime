import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Chargement...</Text>
    </View>
  );
};

export default LoadingScreen;
