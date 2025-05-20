import React from 'react';

export function LogoSVG({ className, showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className="font-extrabold text-2xl tracking-widest animate-gradient-shimmer bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradient-shimmer 2s linear infinite',
        }}
      >
        AR
      </span>
      <style jsx>{`
        @keyframes gradient-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
} 