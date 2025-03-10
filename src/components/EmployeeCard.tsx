import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmployeeCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Employee Card</Text>
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

export default EmployeeCard;
