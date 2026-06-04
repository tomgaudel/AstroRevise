import { useState, useCallback } from 'react';
import { apiClient } from '../services/api.js';
import { useAuthStore } from './useAuth.js';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setToken } = useAuthStore();

  const register = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const response = await apiClient.register(email, password);
        setEmail('');
        setPassword('');
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.error || 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [email, password]
  );

  const login = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const response = await apiClient.login(email, password);
        const { user, token } = response.data;

        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);

        setEmail('');
        setPassword('');

        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.error || 'Login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, setUser, setToken]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    register,
    login,
  };
};
