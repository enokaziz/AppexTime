import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Importer les fonctions Firestore
import _ from 'lodash';

const attendanceCollection = collection(db, 'attendance'); // Référence à la collection "attendance"

export const fetchAttendance = async () => {
  try {
    const snapshot = await getDocs(attendanceCollection); // Récupérer les présences depuis Firestore
    const attendanceRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formater les données
    return attendanceRecords; // Retourner les données
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
};

export const markAttendance = _.memoize(async (data: any) => {
  try {
    const response = await addDoc(attendanceCollection, data); // Ajouter une présence à Firestore
    return response.id; // Retourner l'ID du document ajouté
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
});
