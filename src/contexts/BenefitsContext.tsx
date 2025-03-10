import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Importer la bibliothèque de notifications

import { Benefit } from '../types'; // Importer l'interface Benefit

interface BenefitsContextType {
  benefits: Benefit[];
  setBenefits: React.Dispatch<React.SetStateAction<Benefit[]>>;
}

const BenefitsContext = createContext<BenefitsContextType | undefined>(undefined);

export const BenefitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        // Remplacez ceci par votre logique d'appel API
        const response = await fetch('/api/benefits'); // Exemple d'API
        const data = await response.json();
        setBenefits(data);
        toast.success('Données des avantages récupérées avec succès !'); // Notification de succès
      } catch (error) {
        console.error('Erreur lors de la récupération des avantages:', error);
        toast.error('Erreur lors de la récupération des avantages.'); // Notification d'erreur
      }
    };

    fetchBenefits();
  }, []);

  return (
    <BenefitsContext.Provider value={{ benefits, setBenefits }}>
      {children}
    </BenefitsContext.Provider>
  );
};

export const useBenefits = () => {
  const context = useContext(BenefitsContext);
  if (context === undefined) {
    throw new Error('useBenefits must be used within a BenefitsProvider');
  }
  return context;
};