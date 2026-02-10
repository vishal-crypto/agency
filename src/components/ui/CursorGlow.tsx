'use client';

import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide the default cursor
    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty('--glow-x', `${e.clientX}px`);
        glowRef.current.style.setProperty('--glow-y', `${e.clientY}px`);
        glowRef.current.style.opacity = '1';
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
        dotRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-50 opacity-0 transition-opacity duration-200"
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 1) 0%, rgba(124, 58, 237, 0.8) 50%, rgba(124, 58, 237, 0) 100%)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px rgba(124, 58, 237, 0.8), 0 0 20px rgba(124, 58, 237, 0.4)',
        }}
      />
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(124, 58, 237, 0.25) 0%, rgba(124, 58, 237, 0.15) 10%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)`,
        }}
      />
    </>
  );
}
