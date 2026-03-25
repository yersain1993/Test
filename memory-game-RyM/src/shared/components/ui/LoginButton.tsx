import type { ButtonHTMLAttributes } from 'react';
import { mergeClassNames } from '@/shared/utils';

type LoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

const LoginButton = ({
  children = 'Iniciar sesión',
  className = '',
  disabled,
  isLoading = false,
  type = 'submit',
  ...props
}: LoginButtonProps) => {
  const classes = mergeClassNames(
    'auth-button',
    className
  );

  return (
    <button className={classes} disabled={disabled || isLoading} type={type} {...props}>
      {isLoading ? 'Iniciando...' : children}
    </button>
  );
};

export default LoginButton;
