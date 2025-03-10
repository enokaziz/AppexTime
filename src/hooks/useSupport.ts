import { useContext } from 'react';
import { SupportContext } from '../contexts/SupportContext';

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};
