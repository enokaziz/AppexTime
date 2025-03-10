import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SupportCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Support Card</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SupportCard;
