import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message'; // Notifications mobiles

interface Employee {
  id: string;
  name: string;
  firstName: string;
  phoneNumber: string;
  photoUrl: string;
  employeeId: string;
  qrCode: string;
  [key: string]: any; // Ajout de la signature d'index
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  fetchEmployees: () => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const employeesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];
      setEmployees(employeesData);
      Toast.show({
  type: 'success',
  text1: 'Succès',
  text2: 'Données des employés récupérées avec succès !',
}); // Notification de succès
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      Toast.show({
  type: 'error',
  text1: 'Erreur',
  text2: 'Erreur lors de la récupération des employés.',
}); // Notification d'erreur
    }
  };

  const addEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      await addDoc(collection(db, 'employees'), employee);
      fetchEmployees();
      Toast.show({
  type: 'success',
  text1: 'Succès',
  text2: 'Employé ajouté avec succès !',
}); // Notification de succès
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'employé:', error);
      Toast.show({
  type: 'error',
  text1: 'Erreur',
  text2: "Erreur lors de l'ajout de l'employé.",
}); // Notification d'erreur
    }
  };

  const updateEmployee = async (employee: Employee) => {
    try {
      await updateDoc(doc(db, 'employees', employee.id),employee);
      fetchEmployees();
      Toast.show({
  type: 'success',
  text1: 'Succès',
  text2: 'Employé mis à jour avec succès !',
}); // Notification de succès
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      Toast.show({
  type: 'error',
  text1: 'Erreur',
  text2: "Erreur lors de la mise à jour de l'employé.",
}); // Notification d'erreur
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
      fetchEmployees();
      Toast.show({
  type: 'success',
  text1: 'Succès',
  text2: 'Employé supprimé avec succès !',
}); // Notification de succès
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      Toast.show({
  type: 'error',
  text1: 'Erreur',
  text2: "Erreur lors de la suppression de l'employé.",
}); // Notification d'erreur
    }
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee, fetchEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
};