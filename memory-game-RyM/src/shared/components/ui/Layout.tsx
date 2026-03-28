import { mergeClassNames } from '@/shared/utils';
import headerLogo from '@/assets/header.svg';
import type { PropsWithChildren } from 'react';
import { useAuth } from '@/features/auth/context/userContext';

type LayoutProps = PropsWithChildren<{
  className?: string;
}>;

const Layout = ({ children, className = '' }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  const classes = mergeClassNames(
    'relative flex flex-col min-h-screen w-full items-center justify-center bg-[#1C1D3B] p-4 sm:p-8',
    className
  );

  return (
    <section className={classes}>
      {isAuthenticated && (
        <div className="mb-7 flex items-center justify-center">
          <img src={headerLogo} alt="Header" className="h-55 w-[519.69px]" />
        </div>
      )}
      <main>{children}</main>
    </section>
  );
};

export default Layout;
