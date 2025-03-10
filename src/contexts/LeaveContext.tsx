import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface Leave {
  employeeName: ReactNode;
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status?: string; // Optional status property
}

interface LeaveContextType {
  leaves: Leave[];
  setLeaves: React.Dispatch<React.SetStateAction<Leave[]>>;
  approveLeave: (id: string) => void;
  rejectLeave: (id: string) => void;
}

export const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch('/api/leaves');
        const data = await response.json();
        setLeaves(data);
        toast.success('Leave data fetched successfully!');
      } catch (error) {
        console.error('Error fetching leaves:', error);
        toast.error('Error fetching leaves.');
      }
    };

    fetchLeaves();
  }, []);

  const approveLeave = (id: string) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map(leave =>
        leave.id === id ? { ...leave, status: 'approved' } : leave
      )
    );
  };

  const rejectLeave = (id: string) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map(leave =>
        leave.id === id ? { ...leave, status: 'rejected' } : leave
      )
    );
  };

  return (
    <LeaveContext.Provider value={{ leaves, setLeaves, approveLeave, rejectLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};