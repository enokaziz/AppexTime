import React, { createContext, useContext, useState, useCallback } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  overlay: string;
}

interface Theme {
  colors: ThemeColors;
  dark: boolean;
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    border: '#C6C6C8',
    notification: '#FF3B30',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
    notification: '#FF453A',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme.dark ? lightTheme : darkTheme));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
