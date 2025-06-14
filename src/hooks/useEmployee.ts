import { useState, useEffect } from 'react';
import { Employee } from '../types/index';
import {
  addEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeHistory,
} from '../services/employee';

const useEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getEmployees();
        setEmployees(fetchedEmployees);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            'Erreur lors de la récupération des employés:',
            error.message,
          );
        } else {
          console.error('Erreur lors de la récupération des employés');
        }
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (
    name: string,
    firstName: string,
    phoneNumber: string,
    photo: string,
    companyInitials: string,
    qrCodeUrl: string = '',
    uniqueId: string = `EMP-${Date.now()}`
  ) => {
    try {
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`,
        name,
        firstName,
        phoneNumber,
        photo,
        companyInitials,
        qrCodeUrl,
        uniqueId
      };
      
      await addEmployee(newEmployee);
      setEmployees([...employees, newEmployee]);
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de l'employé :",
        error instanceof Error ? error.message : 'Erreur inconnue',
      );
      throw new Error(
        "Erreur lors de l'ajout de l'employé. Veuillez réessayer.",
      );
    }
  };

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    try {
      await updateEmployee(updatedEmployee);
      setEmployees(
        employees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee,
        ),
      );
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'employé :",
        error instanceof Error ? error.message : 'Erreur inconnue',
      );
      throw new Error(
        "Erreur lors de la mise à jour de l'employé. Veuillez réessayer.",
      );
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId);
      setEmployees(employees.filter((employee) => employee.id !== employeeId));
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'employé :",
        error instanceof Error ? error.message : 'Erreur inconnue',
      );
      throw new Error(
        "Erreur lors de la suppression de l'employé. Veuillez réessayer.",
      );
    }
  };

  const handleGetEmployee = async (employeeId: string) => {
    try {
      const fetchedEmployee = await getEmployee(employeeId);
      return fetchedEmployee;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          error.message || "Erreur lors de la récupération de l'employé",
        );
      } else {
        throw new Error("Erreur lors de la récupération de l'employé");
      }
    }
  };

  const handleGetEmployeeHistory = async (employeeId: string) => {
    try {
      const history = await getEmployeeHistory(employeeId, 0);
      return history;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'historique de l'employé:",
        error,
      );
    }
  };

  return {
    employees,
    handleAddEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,
    handleGetEmployee,
    handleGetEmployeeHistory,
  };
};

export default useEmployee;
