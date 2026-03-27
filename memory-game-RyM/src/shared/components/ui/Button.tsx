import type { ButtonHTMLAttributes } from 'react';
import { mergeClassNames } from '@/shared/utils';

type ButtonVariant = 'submit' | 'play' | 'home';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: ButtonVariant;
};

const baseStyles =
  'h-14 w-auto rounded-2xl border px-8 text-[1.125rem] font-medium tracking-[0.14em] transition active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none focus-visible:outline-none focus-visible:ring-4 sm:text-[1.625rem]';

const variantStyles: Record<ButtonVariant, string> = {
  submit:
    'border-[#1d8993] bg-[#21838d] text-[#f3f7f8] shadow-[0_6px_0_#c8df3f] hover:bg-[#1f7881] active:shadow-[0_4px_0_#c8df3f] focus-visible:ring-[#19a7b899]',
  play: 'border-[#D8E054] bg-[#A2F2F9] text-[#1d8993] shadow-[0_6px_0_#D8E054] hover:bg-[#8DE0E8] active:shadow-[0_4px_0_#D8E054] focus-visible:ring-[#A2F2F999]',
  home: 'border-[#A2F2F9] bg-[#D8E054] text-[#1d8993] shadow-[0_6px_0_#A2F2F9] hover:bg-[#C8D044] active:shadow-[0_4px_0_#A2F2F9] focus-visible:ring-[#D8E05499]',
};

const Button = ({
  children = 'Iniciar sesión',
  className = '',
  disabled,
  isLoading = false,
  type = 'submit',
  variant = 'submit',
  ...props
}: ButtonProps) => {
  const classes = mergeClassNames(
    baseStyles,
    variantStyles[variant],
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? 'Iniciando...' : children}
    </button>
  );
};

export default Button;
