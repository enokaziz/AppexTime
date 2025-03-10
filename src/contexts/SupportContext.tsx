import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportRequest } from '../types/index';
import { toast } from 'react-toastify'; // Importer la bibliothèque de notifications

interface SupportContextType {
  supportRequests: SupportRequest[];
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);

  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        // Remplacez ceci par votre logique d'appel API
        const response = await fetch('/api/support-requests'); // Exemple d'API
        const data = await response.json();
        setSupportRequests(data);
        toast.success('Demandes de support récupérées avec succès !'); // Notification de succès
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes de support:', error);
        toast.error('Erreur lors de la récupération des demandes de support.'); // Notification d'erreur
      }
    };

    fetchSupportRequests();
  }, []);

  return (
    <SupportContext.Provider value={{ supportRequests }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};

export { SupportContext };