import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import logo from '@/assets/logo.png';
import Button from '@/shared/components/ui/Button';
import PasswordVisibilityButton from '@/shared/components/ui/PasswordVisibilityButton';
import { useAuth } from '@/shared/context/userContext';

type LoginFormValues = {
  email: string;
  password: string;
};

const invalidCredentialsMessage = 'usuario o contrasena incorrecta';

type LoginCardProps = {
  onSuccess?: () => void;
};

const LoginCard = ({ onSuccess }: LoginCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
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

    const result = await login({
      email: values.email.trim(),
      password: values.password,
    });

    if (!result.ok) {
      if (result.reason === 'invalid_credentials') {
        setServerError(invalidCredentialsMessage);
        return;
      }

      setServerError('No se pudo iniciar sesion');
      return;
    }

    reset({
      email: values.email,
      password: '',
    });
    setShowPassword(false);
    onSuccess?.();
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-180 rounded-[36px] border-2 border-[#1f3247] bg-[#FFFAC2] px-7 py-8 shadow-[0_6px_0_#c8df3f] sm:px-12 sm:py-10 md:px-14 md:py-12">
        <div className="mb-8 flex justify-center sm:mb-10">
          <img
            src={logo}
            alt="Rick and Morty"
            className="h-auto w-60 max-w-full sm:w-75 md:w-85"
          />
        </div>

        <form
          className="mx-auto w-full max-w-140 space-y-6 sm:space-y-7"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="block space-y-2.5">
            <span className="block text-xl font-bold text-[#2f3f56]">
              Usuario
            </span>
            <input
              autoComplete="email"
              className="h-16 w-full rounded-2xl border-[3px] border-[#26344b] bg-transparent px-6 text-xl text-[#1f3247] transition outline-none focus:border-[#1f3247] focus:ring-4 focus:ring-[#19a7b866]"
              type="email"
              {...register('email', {
                required: 'Ingresa tu usuario',
              })}
            />
            {errors.email ? (
              <span className="block text-base font-semibold text-red-600">
                {errors.email.message}
              </span>
            ) : null}
          </label>

          <label className="block space-y-2.5">
            <span className="block text-xl font-bold text-[#2f3f56]">
              Contrasena
            </span>
            <div className="relative">
              <input
                autoComplete="current-password"
                className="h-16 w-full rounded-2xl border-[3px] border-[#26344b] bg-transparent px-6 pr-16 text-xl text-[#1f3247] transition outline-none focus:border-[#1f3247] focus:ring-4 focus:ring-[#19a7b866]"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Ingresa tu contrasena',
                })}
              />
              <PasswordVisibilityButton
                className="absolute top-1/2 right-5 -translate-y-1/2"
                hiddenLabel="Mostrar contrasena"
                onToggle={() => setShowPassword((current) => !current)}
                visible={showPassword}
                visibleLabel="Ocultar contrasena"
              />
            </div>
            {errors.password ? (
              <span className="block text-base font-semibold text-red-600">
                {errors.password.message}
              </span>
            ) : null}
          </label>

          <Button
            disabled={isSubmitting}
            isLoading={isSubmitting}
            type="submit"
          />

          <div className="space-y-4 text-center">
            <div>
              <Link
                className="inline-block text-xl font-semibold text-[#405172] transition hover:text-[#1f3247] hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#19a7b8] focus-visible:outline-none"
                to="/register"
              >
                ¿No tienes cuenta? Registrate
              </Link>
            </div>
          </div>

          <p
            aria-live="polite"
            className="text-center text-base font-semibold text-red-600"
            role="alert"
          >
            {serverError}
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginCard;
