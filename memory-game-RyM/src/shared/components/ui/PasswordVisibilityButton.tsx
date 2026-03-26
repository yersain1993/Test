import { Eye, EyeOff } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

import { mergeClassNames } from '@/shared/utils';

type PasswordVisibilityButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'children'
> & {
  visible: boolean;
  onToggle: () => void;
  size?: number;
  visibleLabel?: string;
  hiddenLabel?: string;
};

const PasswordVisibilityButton = ({
  visible,
  onToggle,
  size = 36,
  visibleLabel = 'Ocultar contrasena',
  hiddenLabel = 'Mostrar contrasena',
  className = '',
  ...props
}: PasswordVisibilityButtonProps) => {
  const ariaLabel = visible ? visibleLabel : hiddenLabel;

  return (
    <button
      aria-label={ariaLabel}
      className={mergeClassNames(
        'text-[#3d4f69] transition hover:text-[#1f3247] focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[#19a7b8] focus-visible:outline-none',
        className
      )}
      type="button"
      onClick={onToggle}
      {...props}
    >
      {visible ? <EyeOff size={size} /> : <Eye size={size} />}
    </button>
  );
};

export default PasswordVisibilityButton;
