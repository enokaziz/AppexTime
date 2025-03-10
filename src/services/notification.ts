import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Importer les fonctions Firestore
import _ from 'lodash';

const notificationsCollection = collection(db, 'notifications'); // Référence à la collection "notifications"

export const fetchNotifications = async () => {
  try {
    const snapshot = await getDocs(notificationsCollection); // Récupérer les notifications depuis Firestore
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formater les données
    return notifications; // Retourner les données
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const sendNotification = _.memoize(async (data: any) => {
  try {
    const response = await addDoc(notificationsCollection, data); // Ajouter une notification à Firestore
    return response.id; // Retourner l'ID du document ajouté
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
});
