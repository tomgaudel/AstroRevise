import React, { useState, useEffect } from 'react';
import { useTodayTasks } from '../hooks/useTodayTasks.js';
import { useLowMasteryChapters } from '../hooks/useLowMasteryChapters.js';
import { apiClient } from '../services/api.js';
import { TaskItem } from '../components/TaskItem.js';
import { ChapterCard } from '../components/ChapterCard.js';
import { LoadingSpinner } from '../components/FormElements.js';
import { AlertCircle, CheckCircle2, TrendingUp, Radio } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { tasks, isLoading: tasksLoading } = useTodayTasks();
  const { chapters, isLoading: chaptersLoading } = useLowMasteryChapters();
  const [ankiConnected, setAnkiConnected] = useState(false);
  const [completedToday, setCompletedToday] = useState(0);

  useEffect(() => {
    const checkAnki = async () => {
      try {
        const response = await apiClient.checkAnkiConnection();
        setAnkiConnected(response.data.connected);
      } catch (error) {
        setAnkiConnected(false);
      }
    };

    checkAnki();
  }, []);

  useEffect(() => {
    const completed = tasks.filter((t) => t.completed).length;
    setCompletedToday(completed);
  }, [tasks]);

  const handleTaskToggle = async (id: string, completed: boolean) => {
    try {
      await apiClient.updateTask(id, { completed });
      // Refresh tasks
      window.location.reload();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Tableau de bord</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Tâches aujourd'hui</p>
              <p className="text-3xl font-bold text-slate-900">{tasks.length}</p>
            </div>
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Complétées</p>
              <p className="text-3xl font-bold text-slate-900">{completedToday}</p>
            </div>
            <TrendingUp className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Chapitres faibles</p>
              <p className="text-3xl font-bold text-slate-900">{chapters.length}</p>
            </div>
            <AlertCircle className="text-red-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Anki</p>
              <p className="text-sm font-medium mt-1">
                {ankiConnected ? '🟢 Connecté' : '🔴 Non disponible'}
              </p>
            </div>
            <Radio className={ankiConnected ? 'text-green-500' : 'text-slate-400'} size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Tâches d'aujourd'hui</h2>
          {tasksLoading ? (
            <div className="flex justify-center p-8">
              <LoadingSpinner />
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg">
              <p className="text-slate-500">Aucune tâche pour aujourd'hui</p>
            </div>
          )}
        </div>

        {/* Low Mastery Chapters */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">À renforcer</h2>
          {chaptersLoading ? (
            <div className="flex justify-center p-8">
              <LoadingSpinner />
            </div>
          ) : chapters.length > 0 ? (
            <div className="space-y-3">
              {chapters.slice(0, 5).map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg">
              <p className="text-slate-500">Excellent ! Tous vos chapitres sont bien maîtrisés</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
