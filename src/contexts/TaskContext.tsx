import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Toast from 'react-native-toast-message';

interface Task {
  assignedTo: ReactNode;
  id: string;
  title: string;
  description: string;
  completed: boolean;
  employeeName: string;
  employeeId: string;
}

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  assignTask: (task: Task) => void;
  completeTask: (id: string) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setTasks(data);
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Tâche ajoutée avec succès !',
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: "Erreur lors de l'ajout de la tâche.",
        });
      }
    };

    fetchTasks();
  }, []);

  const assignTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const completeTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, assignTask, completeTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};