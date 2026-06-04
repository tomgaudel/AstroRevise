import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuthForm } from '../hooks/useAuthForm.js';
import { FormError, SubmitButton } from '../components/FormElements.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { email, setEmail, password, setPassword, isLoading, error, login } = useAuthForm();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      await login(e);
      navigate('/');
    } catch (err) {
      // Error is already set in the hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-soft p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-neon rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">AstroRevise</h1>
            <p className="text-slate-600">Révisez intelligemment, réussissez brillamment</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormError message={error} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-neon-purple transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-neon-purple transition"
                  required
                />
              </div>
            </div>

            <SubmitButton isLoading={isLoading}>Se connecter</SubmitButton>

            <p className="text-center text-sm text-slate-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-neon-purple hover:underline font-medium">
                S'inscrire
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
