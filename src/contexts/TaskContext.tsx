import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import Toast from 'react-native-toast-message';
import * as taskService from '../services/task';
import { useAppSelector } from '../store/hooks';

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

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user) return;
        const data = await taskService.fetchTasks();
        setTasks(data as unknown as Task[]);
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Tâches récupérées avec succès !',
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Erreur lors du chargement des tâches.',
        });
      }
    };

    fetchTasks();
  }, [user]);

  const assignTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const completeTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task,
      ),
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
