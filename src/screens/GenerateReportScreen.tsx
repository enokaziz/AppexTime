import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GenerateReportScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Generate Report Screen</Text>
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

export default GenerateReportScreen;
