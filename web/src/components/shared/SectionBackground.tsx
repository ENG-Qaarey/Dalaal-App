'use client';

import React from 'react';

interface SectionBackgroundProps {
  variant?: 'default' | 'accent' | 'cta' | 'dark' | 'hero';
  className?: string;
}

const SectionBackground: React.FC<SectionBackgroundProps> = ({ 
  variant = 'default',
  className = '' 
}) => {
  return (
    <>
      {variant === 'default' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-emerald-500/10 rounded-full blur-[70px]" />
          <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </>
      )}

      {variant === 'accent' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-amber-500/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-amber-500/15 rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </>
      )}

      {variant === 'cta' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-amber-500/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-amber-500/15 rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </>
      )}

      {variant === 'dark' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </>
      )}

      {variant === 'hero' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/25 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/15 via-transparent to-cyan-500/15 rounded-full blur-[120px]" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-500/30 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-20 w-40 h-40 bg-amber-500/25 rounded-full blur-[70px]" />
          <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </>
      )}
    </>
  );
};

export default SectionBackground;