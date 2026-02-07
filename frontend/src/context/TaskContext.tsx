import { createContext, useContext, useState, useCallback } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
  reminderDate?: string;
  category: string;
  aiSuggestion?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasks: (userId?: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTasks = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = userId ? `/api/tasks?userId=${userId}` : '/api/tasks';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure userId is included
      const taskWithUserId = {
        ...task,
        userId: task.userId || localStorage.getItem('userId') || ''
      };
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskWithUserId)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }
      await getTasks(taskWithUserId.userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update task');
      await getTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTasks]);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      await getTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTasks]);

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, getTasks, loading, error }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}
