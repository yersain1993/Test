import { Link } from 'react-router-dom';
import Layout from '@/shared/components/ui/Layout';

const RecoverPasswordScreen = () => {
  return (
    <Layout className="auth-screen">
      <section className="auth-panel">
        <p className="panel-eyebrow">
          Recuperar acceso
        </p>
        <h1 className="panel-title">Recuperar contraseña</h1>
        <p className="panel-subtitle">
          Esta pantalla queda lista para conectar el flujo de recuperación más adelante.
        </p>

        <Link className="auth-panel__link" to="/login">
          Volver al inicio de sesión
        </Link>
      </section>
    </Layout>
  );
};

export default RecoverPasswordScreen;
