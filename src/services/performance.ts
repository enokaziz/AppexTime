import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore'; // Importer les fonctions Firestore
import _ from 'lodash';

const performanceCollection = collection(db, 'performance'); // Référence à la collection "performance"

export const fetchPerformance = async () => {
  try {
    const snapshot = await getDocs(performanceCollection); // Récupérer les données de performance depuis Firestore
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formater les données
  } catch (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }
};

export const updatePerformance = _.memoize(async (data: any) => {
  try {
    const performanceDoc = doc(db, 'performance', data.id); // Référence au document à mettre à jour
    await updateDoc(performanceDoc, data); // Mettre à jour le document
    return data.id; // Retourner l'ID du document mis à jour
  } catch (error) {
    console.error('Error updating performance data:', error);
    throw error;
  }
});

export const getEmployeePerformance = async (employeeId: string) => {
  try {
    const performanceDoc = doc(db, 'performance', employeeId); // Référence au document de performance de l'employé
    const performanceData = await getDoc(performanceDoc);
    if (performanceData.exists()) {
      return { id: performanceData.id, ...performanceData.data() }; // Retourner les données de performance
    }
    return null; // Retourner null si aucune donnée n'est trouvée
  } catch (error) {
    console.error('Error fetching employee performance data:', error);
    throw error;
  }
};
