import React from 'react';
import { View, Text, Button } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

type ErrorScreenProps = {
  navigation: StackNavigationProp<any>;
};

const ErrorScreen: React.FC<ErrorScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Une erreur est survenue. Veuillez réessayer.</Text>
      <Button title="Retour à l'accueil" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default ErrorScreen;
