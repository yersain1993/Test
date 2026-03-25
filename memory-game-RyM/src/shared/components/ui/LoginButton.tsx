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
    'h-14 w-full rounded-2xl border border-[#1d8993] bg-[#21838d] px-8 text-[1.125rem] font-medium tracking-[0.14em] text-[#f3f7f8] shadow-[0_6px_0_#c8df3f] transition hover:bg-[#1f7881] active:translate-y-[1px] active:shadow-[0_4px_0_#c8df3f] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a7b899] sm:text-[1.625rem]',
    className
  );

  return (
    <button className={classes} disabled={disabled || isLoading} type={type} {...props}>
      {isLoading ? 'Iniciando...' : children}
    </button>
  );
};

export default LoginButton;
