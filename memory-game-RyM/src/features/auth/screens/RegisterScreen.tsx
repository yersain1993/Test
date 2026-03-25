import { useNavigate } from 'react-router-dom';
import Layout from '@/shared/components/ui/Layout';
import RegisterCard from '@/features/auth/components/RegisterCard';

const RegisterScreen = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <RegisterCard onSuccess={() => navigate('/login', { replace: true })} />
    </Layout>
  );
};

export default RegisterScreen;
