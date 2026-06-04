import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api.js';
import { Chapter } from '../types/index.js';
import { ChapterCard } from '../components/ChapterCard.js';
import { LoadingSpinner } from '../components/FormElements.js';

export const ChaptersPage: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'weak' | 'strong'>('all');

  useEffect(() => {
    const loadChapters = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getChapters();
        setChapters(response.data);
      } catch (error) {
        console.error('Failed to load chapters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChapters();
  }, []);

  const filteredChapters = chapters.filter((ch) => {
    if (filter === 'weak') return ch.mastery < 70;
    if (filter === 'strong') return ch.mastery >= 70;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Mes Chapitres</h1>

      <div className="flex gap-2 mb-8">
        {[
          { value: 'all' as const, label: 'Tous' },
          { value: 'weak' as const, label: 'À renforcer' },
          { value: 'strong' as const, label: 'Maîtrisés' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === option.value
                ? 'bg-gradient-neon text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-neon-purple'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : filteredChapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-lg">
          <p className="text-slate-500">Aucun chapitre trouvé</p>
        </div>
      )}
    </div>
  );
};
