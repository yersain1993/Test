import { type Variants, type Transition } from 'framer-motion';

export const flipTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
};

export const flipVariants: Variants = {
  front: {
    rotateY: 0,
  },
  back: {
    rotateY: 180,
  },
};
