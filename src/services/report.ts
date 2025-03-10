import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Importer les fonctions Firestore
import _ from 'lodash';

const reportsCollection = collection(db, 'reports'); // Référence à la collection "reports"

export const fetchReport = async () => {
  try {
    const snapshot = await getDocs(reportsCollection); // Récupérer les rapports depuis Firestore
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formater les données
    return reports; // Retourner les données
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

export const generateReport = _.memoize(async (data: any) => {
  try {
    const response = await addDoc(reportsCollection, data); // Ajouter un rapport à Firestore
    return response.id; // Retourner l'ID du document ajouté
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
});
