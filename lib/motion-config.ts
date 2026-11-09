export const POP_IN_VARIANT = {
  initial: { scale: 0.88, opacity: 0, y: 8 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.88, opacity: 0, y: 8 },
};

export const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20,
};

