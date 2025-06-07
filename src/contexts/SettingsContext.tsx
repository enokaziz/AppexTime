import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from 'react-native-toast-message'; // Notifications mobiles

interface Settings {
  theme: string;
  notificationsEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({ theme: 'light', notificationsEnabled: true });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Remplacez ceci par votre logique d'appel API
        const response = await fetch('/api/settings'); // Exemple d'API
        const data = await response.json();
        setSettings(data);
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Thème changé avec succès !',
        }); // Notification de succès
      } catch (error) {
        console.error('Erreur lors de la récupération des paramètres:', error);
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: "Erreur lors du changement de thème.",
        }); // Notification d'erreur
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};