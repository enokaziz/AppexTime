import React, { useEffect } from 'react';
import CacheService from '../services/CacheService';

interface CacheProviderProps {
  children: React.ReactNode;
}

/**
 * Provider pour gérer le service de cache
 * @param children - Composants enfants
 */
export const CacheProvider: React.FC<CacheProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialiser le service de cache
    const cacheService = CacheService.getInstance();

    // Nettoyer le service lors du démontage
    return () => {
      cacheService.cleanup();
    };
  }, []);

  return <>{children}</>;
};
