import { useState, useEffect } from 'react';
import { apiClient } from '../services/api.js';
import { Task } from '../types/index.js';
import { format } from 'date-fns';

export const useTodayTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const response = await apiClient.getTasks(today);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return { tasks, isLoading };
};
