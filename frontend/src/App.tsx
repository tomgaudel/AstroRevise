import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/useAuth.js';
import { Navigation } from './components/Navigation.js';

// Pages
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { HomePage } from './pages/HomePage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ChaptersPage } from './pages/ChaptersPage.js';
import { ChapterDetailPage } from './pages/ChapterDetailPage.js';
import { CalendarPage } from './pages/CalendarPage.js';

// Styles
import './styles/globals.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const { user, setUser, setToken } = useAuthStore();

  useEffect(() => {
    // Load auth state from localStorage on mount
    const token = localStorage.getItem('token');
    if (token && !user) {
      setToken(token);
      // Try to load user from API (optional)
    }
  }, [user, setUser, setToken]);

  return (
    <BrowserRouter>
      <Navigation />
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chapters"
            element={
              <ProtectedRoute>
                <ChaptersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chapter/:id"
            element={
              <ProtectedRoute>
                <ChapterDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
