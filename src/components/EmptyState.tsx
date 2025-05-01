import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { absenceStyles } from '../styles/absenceStyles';

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: absenceStyles.title.color,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: absenceStyles.absenceItem.color,
  },
});

export default EmptyState;
