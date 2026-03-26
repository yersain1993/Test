import type { PropsWithChildren } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import RecoverPasswordPage from '@/features/auth/pages/RecoverPasswordPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import GamePage from '@/features/game/pages/GamePage';
import Layout from '@/shared/components/ui/Layout';
import { useAuth } from '@/shared/context/userContext';

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="rounded-2xl border-2 border-[#1f3247] bg-[#FFFAC2] px-6 py-4 text-center font-bold text-[#2f3f56] shadow-[0_4px_0_#c8df3f]">
          Cargando sesión...
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="rounded-2xl border-2 border-[#1f3247] bg-[#FFFAC2] px-6 py-4 text-center font-bold text-[#2f3f56] shadow-[0_4px_0_#c8df3f]">
          Cargando sesión...
        </div>
      </Layout>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/game" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/game" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/recover-password" element={<RecoverPasswordPage />} />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
