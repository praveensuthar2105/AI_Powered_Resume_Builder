import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({
  className,
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-brand-primary hover:bg-brand-teal text-white shadow-sm border border-transparent',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm border border-transparent dark:bg-slate-800 dark:hover:bg-slate-700',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-850 dark:hover:bg-slate-800 dark:text-slate-300',
    glass: 'bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-slate-800 dark:text-slate-100 shadow-[0_4px_12px_rgba(255,255,255,0.01)]',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-6 py-3 text-sm gap-2.5'
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
