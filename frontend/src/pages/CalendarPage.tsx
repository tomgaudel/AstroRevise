import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { apiClient } from '../services/api.js';
import { Task } from '../types/index.js';
import { TaskItem } from '../components/TaskItem.js';
import { LoadingSpinner } from '../components/FormElements.js';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export const CalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
        const response = await apiClient.getTasks(undefined, startDate, endDate);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [currentMonth]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const tasksForSelectedDate = tasks.filter((task) =>
    isSameDay(new Date(task.scheduled_date), selectedDate)
  );

  const handleTaskToggle = async (id: string, completed: boolean) => {
    try {
      await apiClient.updateTask(id, { completed });
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed } : t)));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.scheduled_date), date));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
        <CalendarIcon size={32} />
        Calendrier de révision
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md-soft p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </h2>
            <button
              onClick={() => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div key={day} className="text-center font-semibold text-slate-600 py-2">
                {day}
              </div>
            ))}

            {daysInMonth.map((date) => {
              const dayTasks = getTasksForDay(date);
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());

              return (
                <button
                  key={date.toString()}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-2 rounded-lg border-2 text-center transition ${
                    isSelected
                      ? 'border-neon-purple bg-purple-50'
                      : isToday
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-semibold">{date.getDate()}</div>
                  {dayTasks.length > 0 && (
                    <div className="text-xs text-neon-purple font-medium mt-1">
                      {dayTasks.length} tâche{dayTasks.length > 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks for selected date */}
        <div className="bg-white rounded-lg shadow-md-soft p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
          </h3>

          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : tasksForSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {tasksForSelectedDate.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">Aucune tâche ce jour</p>
              <button className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-gradient-neon text-white hover:shadow-md-soft">
                <Plus size={20} />
                <span>Ajouter une tâche</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
