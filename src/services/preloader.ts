import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as employeeService from './employee';
import * as leaveService from './leave';
import * as taskService from './task';
import * as attendanceService from './attendance';
import * as cacheService from '../services/cache';

/**
 * Service de préchargement des données
 * Permet de charger à l'avance les données fréquemment utilisées
 * pour améliorer les performances de l'application
 */

// Liste des ressources à précharger par priorité
const PRELOAD_RESOURCES = {
  HIGH: ['currentUser', 'notifications', 'tasks'],
  MEDIUM: ['team', 'recentAttendance', 'pendingLeaves'],
  LOW: ['companyInfo', 'benefits', 'reports'],
};

// Fonction pour précharger les données utilisateur essentielles
export const preloadUserData = async (userId: string) => {
  try {
    // Préchargement parallèle des données critiques
    const promises = [
      // Utilisation de getEmployee au lieu de getEmployeeDetails
      employeeService
        .getEmployee(userId)
        .then((data) =>
          cacheService.setItem('currentUser', data, { priority: 'HIGH' }),
        ),
      // Utilisation de fetchTasks au lieu de getAssignedTasks
      // et filtrage des tâches de l'utilisateur
      taskService
        .fetchTasks()
        .then((tasks: any[]) => {
          const userTasks = tasks.filter((task) => task.assignedTo === userId);
          return cacheService.setItem('tasks', userTasks, { priority: 'HIGH' });
        }),
    ];

    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error(
      'Erreur lors du préchargement des données utilisateur:',
      error,
    );
    return false;
  }
};

// Fonction pour précharger les données d'équipe
export const preloadTeamData = async (teamId: string) => {
  try {
    // Récupération de tous les employés et filtrage par équipe
    const allEmployees = await employeeService.getEmployees();
    const teamMembers = allEmployees.filter(employee => 
      // Supposons que l'employé a une propriété teamId
      (employee as any).teamId === teamId
    );
    await cacheService.setItem('team', teamMembers, { priority: 'MEDIUM' });

    // Nous n'avons pas de méthode getTeamAttendance, donc nous simulons
    // en utilisant les données disponibles
    // Cette partie serait à adapter selon la structure réelle de vos données
    const mockAttendance = {
      date: new Date().toISOString(),
      teamId: teamId,
      present: teamMembers.length,
      absent: 0,
      late: 0
    };
    await cacheService.setItem('recentAttendance', mockAttendance, {
      priority: 'MEDIUM',
    });

    return true;
  } catch (error) {
    console.error("Erreur lors du préchargement des données d'équipe:", error);
    return false;
  }
};

// Fonction pour précharger les demandes de congés en attente
export const preloadPendingLeaves = async (managerId: string) => {
  try {
    // Récupération de tous les congés et filtrage des congés en attente
    const allLeaves = await leaveService.getLeaves();
    const pendingLeaves = allLeaves.filter(leave => 
      // Supposons que le congé a un statut et est lié à un manager
      (leave as any).status === 'pending' && (leave as any).managerId === managerId
    );
    await cacheService.setItem('pendingLeaves', pendingLeaves, {
      priority: 'MEDIUM',
    });
    return true;
  } catch (error) {
    console.error(
      'Erreur lors du préchargement des demandes de congés:',
      error,
    );
    return false;
  }
};

// Hook pour précharger les données en fonction du rôle utilisateur
export const usePreloader = (userId: string, role: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadInitialData = async () => {
      // Préchargement des données utilisateur pour tous les rôles
      await preloadUserData(userId);

      // Préchargement spécifique au rôle
      if (role === 'MANAGER' || role === 'ADMIN') {
        // Récupération de l'employé pour obtenir son équipe
        const employee = await employeeService.getEmployee(userId);
        if (employee && (employee as any).teamId) {
          await preloadTeamData((employee as any).teamId);
        }

        if (role === 'MANAGER') {
          await preloadPendingLeaves(userId);
        }
      }
    };

    loadInitialData();
  }, [userId, role, dispatch]);
};

// Fonction pour précharger les données d'un écran spécifique
export const preloadScreenData = async (screenName: string, params: any) => {
  switch (screenName) {
    case 'EmployeeList':
      // Utilisation de getEmployees au lieu de getAllEmployees
      const employees = await employeeService.getEmployees();
      await cacheService.setItem('allEmployees', employees, {
        priority: 'MEDIUM',
      });
      break;
    case 'LeaveManagement':
      // Utilisation de getLeaves et filtrage par utilisateur
      const allLeaves = await leaveService.getLeaves();
      const leaveHistory = allLeaves.filter(leave => 
        (leave as any).employeeId === params.userId
      );
      await cacheService.setItem(
        `leaveHistory_${params.userId}`,
        leaveHistory,
        { priority: 'MEDIUM' },
      );
      break;
    case 'TaskManagement':
      // Utilisation de fetchTasks au lieu de getAllTasks
      const tasks = await taskService.fetchTasks();
      await cacheService.setItem('allTasks', tasks, { priority: 'MEDIUM' });
      break;
    default:
      break;
  }
};
