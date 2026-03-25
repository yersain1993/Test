import type { PropsWithChildren } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import RecoverPasswordScreen from '@/features/auth/screens/RecoverPasswordScreen';
import RegisterScreen from '@/features/auth/screens/RegisterScreen';
import GameScreen from '@/features/game/screens/GameScreen';
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
            <LoginScreen />
          </PublicRoute>
        }
      />
      <Route path="/recover-password" element={<RecoverPasswordScreen />} />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <GameScreen />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
