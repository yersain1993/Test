import { mergeClassNames } from '@/shared/utils';
import type { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren<{
  className?: string;
}>;

const Layout = ({ children, className = '' }: LayoutProps) => {
  const classes = mergeClassNames(
    'flex min-h-screen w-full items-center justify-center bg-[#1C1D3B] p-4 sm:p-8',
    className
  );

  return <main className={classes}>{children}</main>;
};

export default Layout;
