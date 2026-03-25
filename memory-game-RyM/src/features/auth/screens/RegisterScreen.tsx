import { Link } from 'react-router-dom';
import Layout from '@/shared/components/ui/Layout';

const RegisterScreen = () => {
  return (
    <Layout className="auth-screen">
      <section className="auth-panel">
        <p className="panel-eyebrow">
          Crear cuenta
        </p>
        <h1 className="panel-title">Registrarse</h1>
        <p className="panel-subtitle">
          Esta pantalla queda lista para conectar el flujo de registro más adelante.
        </p>

        <Link className="auth-panel__link" to="/login">
          Volver al inicio de sesión
        </Link>
      </section>
    </Layout>
  );
};

export default RegisterScreen;
