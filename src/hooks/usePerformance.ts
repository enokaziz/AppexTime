import { useState } from 'react';
import { Employee } from '../types/index';
import { getEmployeePerformance } from '../services/performance';

const usePerformance = () => {
  const [performances, setPerformances] = useState<Record<string, any>>({});

  const evaluatePerformance = async (employeeId: string) => {
    try {
      const performance = await getEmployeePerformance(employeeId);
      setPerformances({ ...performances, [employeeId]: performance });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Erreur lors de l\'évaluation de la performance');
      } else {
        throw new Error('Erreur lors de l\'évaluation de la performance');
      }
    }
  };

  return {
    performances,
    evaluatePerformance,
  };
};

export default usePerformance;
