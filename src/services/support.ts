import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Importer les fonctions Firestore
import _ from 'lodash';

const supportCollection = collection(db, 'support'); // Référence à la collection "support"

export const fetchSupport = async () => {
  try {
    const snapshot = await getDocs(supportCollection); // Récupérer les demandes de support depuis Firestore
    const supportRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formater les données
    return supportRequests;
  } catch (error) {
    console.error('Error fetching support data:', error);
    throw error;
  }
};

export const createSupportRequest = _.memoize(async (data: any) => {
  try {
    const response = await addDoc(supportCollection, data); // Ajouter une demande de support à Firestore
    return response.id; // Retourner l'ID du document ajouté
  } catch (error) {
    console.error('Error creating support request:', error);
    throw error;
  }
});
