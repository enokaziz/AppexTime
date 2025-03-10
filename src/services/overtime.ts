import { getDatabase, ref, set, push, remove, onValue } from 'firebase/database';
import { Overtime } from '../types/index';

const database = getDatabase();

export const addOvertime = (overtime: Overtime) => {
  return set(ref(database, `overtimes/${overtime.id}`), overtime);
};

export const updateOvertime = (id: string, overtime: Overtime) => {
  return set(ref(database, `overtimes/${id}`), overtime);
};

export const deleteOvertime = (id: string) => {
  return remove(ref(database, `overtimes/${id}`));
};

export const getOvertimes = () => {
  return new Promise((resolve, reject) => {
    onValue(ref(database, 'overtimes'), (snapshot) => {
      const overtimes = snapshot.val();
      resolve(overtimes);
    }, (error) => {
      reject(error);
    });
  });
};
