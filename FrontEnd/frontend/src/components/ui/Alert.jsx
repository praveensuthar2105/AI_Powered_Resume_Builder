import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const Alert = React.forwardRef(({
  className,
  title,
  children,
  variant = 'info',
  onClose,
  ...props
}, ref) => {
  const variants = {
    info: 'bg-teal-50/20 border-teal-100 text-teal-800 dark:bg-teal-950/10 dark:border-teal-900/30 dark:text-teal-400',
    success: 'bg-emerald-50/20 border-emerald-100 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-50/20 border-amber-100 text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/30 dark:text-amber-400',
    error: 'bg-rose-50/20 border-rose-100 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/30 dark:text-rose-450'
  };

  const icons = {
    info: <Info className="w-5 h-5 text-brand-teal" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative w-full p-4 border rounded-2xl flex items-start gap-3 backdrop-blur-md animate-fade-in font-sans',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="flex-1 flex flex-col gap-0.5">
        {title && <h5 className="font-bold text-[13px] tracking-tight uppercase">{title}</h5>}
        <div className="text-[12px] font-medium leading-relaxed opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 hover:opacity-100 opacity-60 transition-opacity p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg cursor-pointer"
        >
          <XCircle className="w-4.5 h-4.5" />
        </button>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';

export { Alert };
