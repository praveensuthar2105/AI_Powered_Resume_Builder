import React from 'react';
import { cn } from '../../lib/utils';

const GlassCard = React.forwardRef(({
  className,
  children,
  animateHover = true,
  glowEffect = true,
  ...props
}, ref) => {
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!glowEffect || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);
  };

  return (
    <div
      ref={(node) => {
        cardRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative overflow-hidden bg-white/55 backdrop-blur-xl border border-white/70 dark:bg-[#1E293B]/40 dark:border-white/[0.06] rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.03)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.2)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        animateHover && 'hover:-translate-y-1 hover:border-brand-teal/20 hover:shadow-[0_20px_48px_rgba(20,184,166,0.08)]',
        className
      )}
      style={{
        ...props.style,
      }}
      {...props}
    >
      {/* Background tracking light gradient */}
      {glowEffect && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl z-0"
          style={{
            background: 'radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(20, 184, 166, 0.08), transparent 45%)'
          }}
        />
      )}
      
      {/* Glow border highlighting */}
      {animateHover && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-teal to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
      )}
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export { GlassCard };
