'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function Card({
  children,
  className,
  hover = false,
  glow = false,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 lg:p-8',
        'backdrop-blur-sm',
        hover && 'cursor-pointer transition-all duration-300 hover:border-zinc-700',
        glow && 'before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-violet-600/20 before:to-purple-600/20 before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
