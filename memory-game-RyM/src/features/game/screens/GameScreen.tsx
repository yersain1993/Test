import { useNavigate } from 'react-router-dom';

import Layout from '@/shared/components/ui/Layout';
import Button from '@/shared/components/ui/Button';
import { useAuth } from '@/shared/context/userContext';

const GameScreen = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Layout>
      <section className="w-full max-w-3xl rounded-[28px] border-2 border-[#1f3247] bg-[#FFFAC2] px-6 py-8 text-center shadow-[0_6px_0_#c8df3f] sm:px-10 sm:py-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#405172]">
          Game
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#2f3f56] sm:text-4xl">
          Bienvenido{user?.email ? `, ${user.email}` : ''}
        </h1>
        <p className="mt-4 text-base font-medium text-[#405172] sm:text-lg">
          La sesión está protegida con cookies httpOnly y el estado vive en el contexto de usuario.
        </p>

        <div className="mt-8 flex justify-center">
          <Button className="px-8" onClick={handleLogout} type="button">
            Cerrar sesión
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default GameScreen;
