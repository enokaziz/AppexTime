import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Importer les fonctions Firestore

const benefitsCollection = collection(db, 'benefits'); // Référence à la collection "benefits"

export const fetchBenefits = async () => {
  try {
    const snapshot = await getDocs(benefitsCollection); // Récupérer les avantages depuis Firestore
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formater les données
  } catch (error) {
    console.error('Error fetching benefits:', error);
    throw error;
  }
};

export const addBenefit = async (data: any) => {
  try {
    const response = await addDoc(benefitsCollection, data); // Ajouter un avantage à Firestore
    return response.id; // Retourner l'ID du document ajouté
  } catch (error) {
    console.error('Error adding benefit:', error);
    throw error;
  }
};
