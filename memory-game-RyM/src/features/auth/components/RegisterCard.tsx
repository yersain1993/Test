import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type Resolver, useForm } from 'react-hook-form';

import logo from '@/assets/logo.png';
import Button from '@/shared/components/ui/Button';
import PasswordVisibilityButton from '@/shared/components/ui/PasswordVisibilityButton';
import { mergeClassNames } from '@/shared/utils';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/registerSchema';
import { registerUser } from '@/features/auth/services/registerService';
import { buildFieldErrors } from '../utils/buildFieldError';

const registerResolver: Resolver<RegisterFormValues> = async (values) => {
  const parsed = registerSchema.safeParse(values);

  if (parsed.success) {
    return {
      values: parsed.data,
      errors: {},
    };
  }

  return {
    values: {},
    errors: buildFieldErrors(parsed.error.issues),
  };
};

type RegisterCardProps = {
  onSuccess?: () => void;
};

const RegisterCard = ({ onSuccess }: RegisterCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: registerResolver,
    mode: 'onSubmit',
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError('');

    const result = await registerUser({
      email: values.email.trim(),
      password: values.password,
    });

    if (!result.ok) {
      if (result.reason === 'user_already_exists') {
        setServerError('Este usuario ya existe');
        return;
      }

      if (result.reason === 'validation_error') {
        setServerError('Revisa los datos del formulario');
        return;
      }

      setServerError('No se pudo crear la cuenta');
      return;
    }

    reset({
      email: values.email,
      password: '',
      confirmPassword: '',
    });

    onSuccess?.();
  };

  const inputClassName =
    'h-12 w-full rounded-xl border-[2.5px] border-[#26344b] bg-transparent px-4 text-base text-[#1f3247] transition outline-none placeholder:text-[#6a7790] focus:border-[#1f3247] focus:ring-4 focus:ring-[#19a7b84d] sm:h-13 sm:px-5 sm:text-lg';

  return (
    <section className="w-full h-auto px-1 sm:px-0">
      <div className="mx-auto flex w-full max-w-104 flex-col rounded-[28px] border-2 border-[#1f3247] bg-[#FFFAC2] px-5 py-6 shadow-[0_2px_0_#c8df3f] sm:max-w-md sm:px-7 sm:py-7 md:px-8 md:py-8">
        <div className="mb-5 flex flex-col items-center gap-2 text-center sm:mb-6">
          <img
            src={logo}
            alt="Rick and Morty"
            className="h-auto w-60 max-w-full sm:w-75 md:w-85"
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2f3f56] sm:text-3xl">
            Registrarse
          </h1>
        </div>

        <form className="mx-auto w-full space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <label className="block space-y-2">
            <span className="block text-base font-bold text-[#2f3f56] sm:text-lg">
              Usuario
            </span>
            <input
              autoComplete="email"
              className={inputClassName}
              placeholder="usuario@correo.com"
              type="email"
              {...register('email')}
            />
            {errors.email ? (
              <span className="block text-sm font-semibold text-red-600 sm:text-base">
                {errors.email.message}
              </span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="block text-base font-bold text-[#2f3f56] sm:text-lg">
              Contrasena
            </span>
            <div className="relative">
              <input
                autoComplete="new-password"
                className={mergeClassNames(inputClassName, 'pr-14')}
                placeholder="Tu contrasena"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
              />
              <PasswordVisibilityButton
                className="absolute top-1/2 right-3 -translate-y-1/2 p-1"
                hiddenLabel="Mostrar contrasena"
                onToggle={() => setShowPassword((current) => !current)}
                size={22}
                visible={showPassword}
                visibleLabel="Ocultar contrasena"
              />
            </div>
            {errors.password ? (
              <span className="block text-sm font-semibold text-red-600 sm:text-base">
                {errors.password.message}
              </span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="block text-base font-bold text-[#2f3f56] sm:text-lg">
              Confirmar contrasena
            </span>
            <div className="relative">
              <input
                autoComplete="new-password"
                className={mergeClassNames(inputClassName, 'pr-14')}
                placeholder="Repite tu contrasena"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
              />
              <PasswordVisibilityButton
                className="absolute top-1/2 right-3 -translate-y-1/2 p-1"
                hiddenLabel="Mostrar confirmacion de contrasena"
                onToggle={() => setShowConfirmPassword((current) => !current)}
                size={22}
                visible={showConfirmPassword}
                visibleLabel="Ocultar confirmacion de contrasena"
              />
            </div>
            {errors.confirmPassword ? (
              <span className="block text-sm font-semibold text-red-600 sm:text-base">
                {errors.confirmPassword.message}
              </span>
            ) : null}
          </label>

          <Button
            className="h-12 w-full rounded-xl px-6 text-base tracking-[0.12em] sm:text-lg"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="submit"
          >
            Crear cuenta
          </Button>

          <div className="space-y-2 text-center">
            <Link
              className="inline-block text-sm font-semibold text-[#405172] transition hover:text-[#1f3247] hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#19a7b8] focus-visible:outline-none sm:text-base"
              to="/login"
            >
              ¿Ya tienes cuenta? Inicia sesion
            </Link>
          </div>

          <p
            aria-live="polite"
            className="min-h-5 text-center text-sm font-semibold text-red-600 sm:text-base"
            role="alert"
          >
            {serverError}
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegisterCard;
