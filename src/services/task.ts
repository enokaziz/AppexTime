import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from 'firebase/firestore'; // Importer les fonctions Firestore
import _ from 'lodash';

const tasksCollection = collection(db, 'tasks'); // Référence à la collection "tasks"

export const fetchTasks = async () => {
  try {
    const snapshot = await getDocs(tasksCollection); // Récupérer les tâches depuis Firestore
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formater les données
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const addTask = _.memoize(async (data: any) => {
  try {
    const response = await addDoc(tasksCollection, data); // Ajouter une tâche à Firestore
    return response.id; // Retourner l'ID du document ajouté
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
});

export const updateTask = _.memoize(async (id: string, data: any) => {
  try {
    const taskDoc = doc(db, 'tasks', id); // Référence au document à mettre à jour
    await updateDoc(taskDoc, data); // Mettre à jour le document
    return id; // Retourner l'ID du document mis à jour
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
});

export const deleteTask = _.memoize(async (id: string) => {
  try {
    const taskDoc = doc(db, 'tasks', id); // Référence au document à supprimer
    await deleteDoc(taskDoc); // Supprimer le document
    return id; // Retourner l'ID du document supprimé
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
});
