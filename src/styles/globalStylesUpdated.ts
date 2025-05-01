import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  background: '#f8f9fa',
  text: '#212529',
  textDark: '#000000',
  textLight: '#ffffff',
  textSecondary: '#6c757d',
  border: '#dee2e6',
  error: '#dc3545',
  success: '#28a745',
  white: '#ffffff',
  card: '#ffffff',
  shadow: '#000000',
  delete: '#dc3545',
};

export const globalStylesUpdated = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  actionButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.delete,
  },
  button: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  list: {
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    margin: 12,
    borderRadius: 8,
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    margin: 12,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
