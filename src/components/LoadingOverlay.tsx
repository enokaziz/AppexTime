import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = React.memo(
  ({ visible, message }) => {
    const { theme } = useTheme();

    if (!visible) return null;

    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.overlay }]}
      >
        <View style={[styles.content, { backgroundColor: theme.colors.card }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          {message && (
            <Text style={[styles.message, { color: theme.colors.text }]}>
              {message}
            </Text>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
