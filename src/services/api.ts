import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from 'firebase/firestore'; // Importer les fonctions Firestore

const dataCollection = collection(db, 'data'); // Référence à la collection "data"

const fetchData = async () => {
  try {
    const snapshot = await getDocs(dataCollection); // Récupérer les données depuis Firestore
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formater les données
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const postData = async (data: any) => {
  try {
    const response = await addDoc(dataCollection, data); // Ajouter des données à Firestore
    return response.id; // Retourner l'ID du document ajouté
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

const putData = async (id: string, data: any) => {
  try {
    const dataDoc = doc(db, 'data', id); // Référence au document à mettre à jour
    await updateDoc(dataDoc, data); // Mettre à jour le document
    return id; // Retourner l'ID du document mis à jour
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

const deleteData = async (id: string) => {
  try {
    const dataDoc = doc(db, 'data', id); // Référence au document à supprimer
    await deleteDoc(dataDoc); // Supprimer le document
    return id; // Retourner l'ID du document supprimé
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export { fetchData, postData, putData, deleteData };
