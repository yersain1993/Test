import { useNavigate } from 'react-router-dom';
import Layout from '@/shared/components/ui/Layout';
import LoginCard from '@/features/auth/components/LoginCard';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <LoginCard onSuccess={() => navigate('/game', { replace: true })} />
    </Layout>
  );
};

export default LoginPage;
