import { useState, useEffect } from 'react';
import { apiClient } from '../services/api.js';
import { Chapter } from '../types/index.js';

export const useLowMasteryChapters = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getChapters();
        const lowMastery = response.data.filter((c: Chapter) => c.mastery < 70);
        setChapters(lowMastery.sort((a: Chapter, b: Chapter) => a.mastery - b.mastery));
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapters();
  }, []);

  return { chapters, isLoading };
};
