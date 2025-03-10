import { useContext } from 'react';
import { LeaveContext } from '../contexts/LeaveContext';

export default () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};
