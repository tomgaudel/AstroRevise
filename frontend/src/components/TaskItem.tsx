import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types/index.js';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-neon-purple hover:shadow-md-soft transition">
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className="mt-1 text-neon-purple hover:text-neon-violet transition"
      >
        {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className={`font-medium ${task.completed ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h4>
          <span className={`text-xs px-2 py-1 rounded-full ${
            task.subject === 'MATHS'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}>
            {task.subject}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            {task.task_type}
          </span>
        </div>
        {task.estimated_duration && (
          <p className="text-sm text-slate-500 mt-1">{task.estimated_duration} min</p>
        )}
      </div>
    </div>
  );
};
