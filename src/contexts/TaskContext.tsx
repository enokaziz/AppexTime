import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

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
        toast.success('Task data fetched successfully!');
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Error fetching tasks.');
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