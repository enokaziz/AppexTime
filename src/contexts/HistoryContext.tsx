import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Importer la bibliothèque de notifications

interface HistoryItem {
  id: string;
  action: string;
  timestamp: Date;
}

interface HistoryContextType {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Remplacez ceci par votre logique d'appel API
        const response = await fetch('/api/history'); // Exemple d'API
        const data = await response.json();
        setHistory(data);
        toast.success('Données d\'historique récupérées avec succès !'); // Notification de succès
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        toast.error('Erreur lors de la récupération de l\'historique.'); // Notification d'erreur
      }
    };

    fetchHistory();
  }, []);

  return (
    <HistoryContext.Provider value={{ history, setHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};