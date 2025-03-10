import { db } from '../config/firebase';
import { addDoc, collection, getDoc, doc, updateDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { Employee, EmployeeHistory } from '../types/index';
import _ from 'lodash';

export const addEmployee = _.memoize(async (employee: Employee) => {
  try {
    const { name, firstName, phoneNumber, photo, companyInitials, qrCodeUrl, uniqueId } = employee;
    await addDoc(collection(db, 'employees'), {
      name,
      firstName,
      phoneNumber,
      photo,
      companyInitials,
      qrCodeUrl,
      uniqueId
    });
  } catch (error) {
    console.error('Error adding employee:', error);
  }
});


export const getEmployee = async (employeeId: string): Promise<Employee | null> => {
  try {
    const employeeRef = doc(db, 'employees', employeeId);
    const employeeDoc = await getDoc(employeeRef);
    if (employeeDoc.exists()) {
      return { ...employeeDoc.data(), id: employeeDoc.id } as Employee;
    }
    return null;
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
};

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const employeeRef = collection(db, 'employees');
    const querySnapshot = await getDocs(employeeRef);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Employee));
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

export const updateEmployee = _.memoize(async (updatedEmployee: Employee) => {
  try {
    const employeeRef = doc(db, 'employees', updatedEmployee.id);
    await updateDoc(employeeRef, { ...updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
  }
});

export const deleteEmployee = _.memoize(async (employeeId: string) => {
  try {
    const employeeRef = doc(db, 'employees', employeeId);
    await deleteDoc(employeeRef);
  } catch (error) {
    console.error('Error deleting employee:', error);
  }
});

export const getEmployeeHistory = async (employeeId: string, p0: number): Promise<EmployeeHistory[]> => {
  try {
    const historyQuery = query(collection(db, 'history'), where('employeeId', '==', employeeId));
    const querySnapshot = await getDocs(historyQuery);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as EmployeeHistory[];
  } catch (error) {
    console.error('Error fetching employee history:', error);
    return [];
  }
};
