import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth.js';
import { BookOpen, Calendar, Zap, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Bienvenue, <span className="text-gradient-neon">{user.email.split('@')[0]}</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Organisez vos révisions, suivez votre progression et réussissez brillamment
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <button
            onClick={() => navigate('/chapters')}
            className="p-6 bg-white rounded-lg shadow-md-soft hover:shadow-soft hover:border-neon-purple border-2 border-slate-200 transition group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">Mes chapitres</h3>
            <p className="text-sm text-slate-600 mt-1">Gérer vos chapitres et notes</p>
          </button>

          <button
            onClick={() => navigate('/calendar')}
            className="p-6 bg-white rounded-lg shadow-md-soft hover:shadow-soft hover:border-neon-purple border-2 border-slate-200 transition group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">Calendrier</h3>
            <p className="text-sm text-slate-600 mt-1">Planifier vos révisions</p>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="p-6 bg-white rounded-lg shadow-md-soft hover:shadow-soft hover:border-neon-purple border-2 border-slate-200 transition group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">Tableau de bord</h3>
            <p className="text-sm text-slate-600 mt-1">Suivre votre progression</p>
          </button>

          <button
            onClick={() => navigate('/chapters')}
            className="p-6 bg-white rounded-lg shadow-md-soft hover:shadow-soft hover:border-neon-purple border-2 border-slate-200 transition group"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition">
              <Zap className="text-yellow-600" size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">QCM</h3>
            <p className="text-sm text-slate-600 mt-1">Passer des tests</p>
          </button>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md-soft p-8 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Tout ce dont vous avez besoin pour réussir
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="text-blue-600" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Notes structurées</h3>
              <p className="text-slate-600 text-sm">
                Prenez des notes riches en Markdown avec support des images et PDFs
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Calendar className="text-purple-600" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Planification intelligente</h3>
              <p className="text-slate-600 text-sm">
                Organisez vos révisions avec un calendrier et une todo list intégrés
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="text-green-600" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">QCM pratiques</h3>
              <p className="text-slate-600 text-sm">
                Créez vos propres QCM et suivez votre maîtrise de chaque chapitre
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="text-yellow-600" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Intégration Anki</h3>
              <p className="text-slate-600 text-sm">
                Connectez-vous à Anki pour créer des flashcards directement
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="text-red-600" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Statistiques détaillées</h3>
              <p className="text-slate-600 text-sm">
                Suivez votre progression avec des métriques précises par chapitre
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="text-indigo-600" size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Ressources multimédia</h3>
              <p className="text-slate-600 text-sm">
                Intégrez des vidéos YouTube, PDFs et images dans vos chapitres
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
