import { db } from '../config/firebase'; // Importer la configuration Firebase
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from 'firebase/firestore'; // Importer les fonctions Firestore
import { Leave } from '../types/index';

const leavesCollection = collection(db, 'leaves'); // Référence à la collection "leaves"

export const addLeave = async (leave: Leave) => {
  if (!leave.startDate || !leave.endDate || !leave.reason) {
    throw new Error('Tous les champs sont requis.');
  }
  if (new Date(leave.startDate) > new Date(leave.endDate)) {
    throw new Error('La date de début doit être antérieure à la date de fin.');
  }

  const leaveData = {
    startDate: leave.startDate,
    endDate: leave.endDate,
    reason: leave.reason,
  };
  
  try {
    const docRef = await addDoc(leavesCollection, leaveData); // Ajouter un document à la collection
    return { id: docRef.id, ...leaveData }; // Retourner l'ID et les données
  } catch (error) {
    console.error('Erreur lors de l\'ajout du congé:', error);
    throw error;
  }
};

export const updateLeave = async (id: string, leave: Leave) => {
  const leaveDoc = doc(db, 'leaves', id); // Référence au document à mettre à jour
  const leaveData = {
    startDate: leave.startDate,
    endDate: leave.endDate,
    reason: leave.reason,
  };
  return await updateDoc(leaveDoc, leaveData); // Mettre à jour le document
};

export const deleteLeave = async (id: string) => {
  const leaveDoc = doc(db, 'leaves', id); // Référence au document à supprimer
  return await deleteDoc(leaveDoc); // Supprimer le document
};

export const getLeaves = async (): Promise<Leave[]> => {
  const snapshot = await getDocs(leavesCollection); // Récupérer tous les documents de la collection
  const leaves = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
    } as Leave; // Forcer le type ici
  });
  
  // Filtrer les entrées qui ne correspondent pas à l'interface Leave
  return leaves.filter(leave => 
    leave.startDate !== undefined && 
    leave.endDate !== undefined && 
    leave.reason !== undefined
  );
};


