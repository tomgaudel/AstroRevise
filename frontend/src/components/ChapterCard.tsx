import { AlertCircle } from 'lucide-react';
import { Chapter } from '../types/index.js';
import { Link } from 'react-router-dom';

interface ChapterCardProps {
  chapter: Chapter;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'bg-green-100 text-green-700';
    if (mastery >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <Link
      to={`/chapter/${chapter.id}`}
      className="p-4 bg-white rounded-lg border border-slate-200 hover:border-neon-purple hover:shadow-md-soft transition"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-900">{chapter.name}</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMasteryColor(chapter.mastery)}`}>
          {Math.round(chapter.mastery)}%
        </div>
      </div>

      {chapter.description && (
        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{chapter.description}</p>
      )}

      {chapter.mastery < 70 && (
        <div className="flex items-center gap-1 text-sm text-red-600 mt-2">
          <AlertCircle size={16} />
          <span>À renforcer</span>
        </div>
      )}

      <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-gradient-neon h-2 rounded-full transition-all"
          style={{ width: `${chapter.mastery}%` }}
        />
      </div>
    </Link>
  );
};
