import { twMerge } from 'tailwind-merge';

export const mergeClassNames = (...classNames: (string | undefined)[]) => {
  return twMerge(...classNames);
};
