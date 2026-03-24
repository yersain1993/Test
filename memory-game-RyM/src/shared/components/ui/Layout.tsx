import { mergeClassNames } from '@/shared/utils';
import type { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren<{
  className?: string;
}>;

const Layout = ({ children, className = '' }: LayoutProps) => {
  const classes = mergeClassNames(
    'flex-1 bg-[#1C1D3B] min-h-screen w-full',
    className
  );

  return <main className={classes}>{children}</main>;
};

export default Layout;
