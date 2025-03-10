import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore'; // Importer les fonctions Firestore

const companyCollection = collection(db, 'company'); // Référence à la collection "company"

export const fetchCompanySettings = async () => {
  try {
    const snapshot = await getDocs(companyCollection); // Récupérer les paramètres de l'entreprise depuis Firestore
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formater les données
  } catch (error) {
    console.error('Error fetching company settings:', error);
    throw error;
  }
};

export const updateCompanySettings = async (data: any) => {
  try {
    const companyDoc = doc(db, 'company', data.id); // Référence au document à mettre à jour
    await updateDoc(companyDoc, data); // Mettre à jour le document
    return data.id; // Retourner l'ID du document mis à jour
  } catch (error) {
    console.error('Error updating company settings:', error);
    throw error;
  }
};
