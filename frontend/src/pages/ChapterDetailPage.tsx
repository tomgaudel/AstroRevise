import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../services/api.js';
import { Chapter, Note, FileResource, Video, AnkiCard } from '../types/index.js';
import { LoadingSpinner, FormError } from '../components/FormElements.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { FileText, Play, Zap, BookOpen } from 'lucide-react';

export const ChapterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [files, setFiles] = useState<FileResource[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [ankiCards, setAnkiCards] = useState<AnkiCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadChapterData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const [chapterRes, notesRes, filesRes, videosRes, ankiRes] = await Promise.all([
          apiClient.getChapterById(id),
          apiClient.getNotes(id),
          apiClient.getFiles(id),
          apiClient.getVideos(id),
          apiClient.getAnkiCards(id),
        ]);

        setChapter(chapterRes.data);
        setNotes(notesRes.data);
        setFiles(filesRes.data);
        setVideos(videosRes.data);
        setAnkiCards(ankiRes.data);
      } catch (err: any) {
        setError('Erreur lors du chargement du chapitre');
      } finally {
        setIsLoading(false);
      }
    };

    loadChapterData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!chapter) {
    return <FormError message="Chapitre non trouvé" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{chapter.name}</h1>
        {chapter.description && <p className="text-slate-600 mb-4">{chapter.description}</p>}

        <div className="flex items-center gap-4">
          <div className="w-32 h-8 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-neon transition-all"
              style={{ width: `${chapter.mastery}%` }}
            />
          </div>
          <span className="text-lg font-semibold text-slate-900">{Math.round(chapter.mastery)}% maîtrisé</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md-soft">
        <div className="border-b border-slate-200 flex">
          <button className="flex-1 px-6 py-4 text-left hover:bg-slate-50 border-b-2 border-neon-purple">
            <div className="flex items-center gap-2">
              <BookOpen size={20} />
              <span>Notes</span>
            </div>
          </button>
          <button className="flex-1 px-6 py-4 text-left hover:bg-slate-50 text-slate-600">
            <div className="flex items-center gap-2">
              <FileText size={20} />
              <span>Fichiers ({files.length})</span>
            </div>
          </button>
          <button className="flex-1 px-6 py-4 text-left hover:bg-slate-50 text-slate-600">
            <div className="flex items-center gap-2">
              <Play size={20} />
              <span>Vidéos ({videos.length})</span>
            </div>
          </button>
          <button className="flex-1 px-6 py-4 text-left hover:bg-slate-50 text-slate-600">
            <div className="flex items-center gap-2">
              <Zap size={20} />
              <span>Anki ({ankiCards.length})</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900">{note.title}</h3>
                  <div
                    className="mt-2 text-slate-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">Aucune note pour ce chapitre</p>
          )}
        </div>
      </div>
    </div>
  );
};
