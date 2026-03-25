import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginButton from '@/shared/components/ui/LoginButton';

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginResponse = {
  message?: string;
  code?: string;
  accessToken?: string;
  refreshToken?: string;
};

const LOGIN_URL = import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:8000/api/auth/login';

const invalidCredentialsMessage = 'usuario o contraseña incorrecta';

const LoginCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError('');

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as LoginResponse;

      if (!response.ok) {
        if (data.code === 'INVALID_CREDENTIALS' || response.status === 400) {
          setServerError(invalidCredentialsMessage);
          return;
        }

        setServerError('No se pudo iniciar sesión');
        return;
      }

      if (data.accessToken) {
        localStorage.setItem('auth.accessToken', data.accessToken);
      }

      if (data.refreshToken) {
        localStorage.setItem('auth.refreshToken', data.refreshToken);
      }

      reset({
        email: values.email,
        password: '',
      });
      setShowPassword(false);
    } catch {
      setServerError('No se pudo iniciar sesión');
    }
  };

  return (
    <section className="login-card">
      <div className="space-y-2 text-center">
        <p className="card-eyebrow">
          Acceso seguro
        </p>
        <h1 className="card-title">Inicia sesión</h1>
        <p className="card-subtitle">
          Ingresa tus credenciales para continuar con la experiencia.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="auth-field">
          <span className="auth-label">Usuario</span>
          <input
            autoComplete="email"
            className="auth-input"
            placeholder="tuusuario@correo.com"
            type="email"
            {...register('email', {
              required: 'Ingresa tu usuario',
            })}
          />
          {errors.email ? <span className="auth-error">{errors.email.message}</span> : null}
        </label>

        <label className="auth-field">
          <span className="auth-label">Contraseña</span>
          <div className="auth-input-wrap">
            <input
              autoComplete="current-password"
              className="auth-input"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Ingresa tu contraseña',
              })}
            />
            <button
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="auth-toggle"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password ? <span className="auth-error">{errors.password.message}</span> : null}
        </label>

        <LoginButton
          className=""
          disabled={isSubmitting}
          isLoading={isSubmitting}
          type="submit"
        />

        <div className="auth-links">
          <Link className="auth-link" to="/recover-password">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link className="auth-link" to="/register">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>

        <p aria-live="polite" className="auth-error" role="alert">
          {serverError}
        </p>
      </form>
    </section>
  );
};

export default LoginCard;
