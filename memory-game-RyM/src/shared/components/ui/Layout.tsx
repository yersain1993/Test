import { mergeClassNames } from '@/shared/utils';
import headerLogo from '@/assets/header.svg';
import type { PropsWithChildren } from 'react';
import { useAuth } from '@/shared/context/userContext';
import Button from './Button';

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
          {/* <button className="absolute top-53 right-10">
            <span className='flex bg-[#A2F2F9] items-center justify-center gap-2 py-2 px-3 rounded-2xl'>
              <LogOut className='text-[#233A59]'/>
              <h1 className='text-[#233A59]'>Log Out</h1>
            </span>
          </button> */}
          <Button>Log Out</Button>
        </div>
      )}
      <main>{children}</main>
    </section>
  );
};

export default Layout;
