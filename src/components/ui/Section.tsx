'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  id?: string;
}

export function Section({ children, className, containerSize = 'lg', id }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id={id}
      className={cn('py-16 lg:py-24', className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Container size={containerSize}>{children}</Container>
      </motion.div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ title, subtitle, badge, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 lg:mb-16', align === 'center' && 'text-center')}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-violet-400 uppercase bg-violet-500/10 rounded-full border border-violet-500/20"
        >
          {badge}
        </motion.span>
      )}
      <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          'mt-4 text-lg text-zinc-400',
          align === 'center' && 'max-w-2xl mx-auto'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
