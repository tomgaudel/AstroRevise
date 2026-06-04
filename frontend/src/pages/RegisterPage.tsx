import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuthForm } from '../hooks/useAuthForm.js';
import { FormError, SubmitButton } from '../components/FormElements.js';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { email, setEmail, password, setPassword, isLoading, error, register } = useAuthForm();
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    try {
      await register(e);
      // After successful registration, redirect to login
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      // Error is already set in the hook
    }
  };

  const passwordMatch = password === confirmPassword && password.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-soft p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-neon rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Créer un compte</h1>
            <p className="text-slate-600">Commencez votre parcours de révision</p>
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none transition ${
                    confirmPassword
                      ? passwordMatch
                        ? 'border-green-300 focus:border-green-500'
                        : 'border-red-300 focus:border-red-500'
                      : 'border-slate-300 focus:border-neon-purple'
                  }`}
                  required
                />
              </div>
            </div>

            <SubmitButton isLoading={isLoading} disabled={!passwordMatch && confirmPassword.length > 0}>
              S'inscrire
            </SubmitButton>

            <p className="text-center text-sm text-slate-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-neon-purple hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
