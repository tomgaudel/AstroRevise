import React from 'react';
import { Menu, X, LogOut, Home, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../hooks/useAuth.js';
import { Link, useNavigate } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-lg text-gradient-neon">AstroRevise</span>
          </Link>

          {/* Desktop Menu */}
          {user && (
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-neon-purple transition">
                <Home size={20} />
                <span>Accueil</span>
              </Link>
              <Link to="/chapters" className="flex items-center gap-2 text-slate-600 hover:text-neon-purple transition">
                <BookOpen size={20} />
                <span>Chapitres</span>
              </Link>
              <Link to="/calendar" className="flex items-center gap-2 text-slate-600 hover:text-neon-purple transition">
                <Calendar size={20} />
                <span>Calendrier</span>
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-neon-purple transition">
                <BarChart3 size={20} />
                <span>Stats</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition"
              >
                <LogOut size={20} />
                <span>Déconnexion</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && user && (
          <div className="md:hidden pb-4 border-t">
            <Link to="/" className="block py-2 text-slate-600 hover:text-neon-purple">
              Accueil
            </Link>
            <Link to="/chapters" className="block py-2 text-slate-600 hover:text-neon-purple">
              Chapitres
            </Link>
            <Link to="/calendar" className="block py-2 text-slate-600 hover:text-neon-purple">
              Calendrier
            </Link>
            <Link to="/dashboard" className="block py-2 text-slate-600 hover:text-neon-purple">
              Stats
            </Link>
            <button onClick={handleLogout} className="block w-full text-left py-2 text-red-500 hover:text-red-600">
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
