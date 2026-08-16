import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Button({ children, className, ...props }: Readonly<ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: Readonly<{ children: ReactNode; className?: string }>) {
  return <div className={cn('rounded-3xl border border-line bg-panel p-6 shadow-soft', className)}>{children}</div>;
}

export function Badge({ children, tone = 'neutral' }: Readonly<{ children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' }>) {
  const tones = {
    neutral: 'bg-panel-alt text-text',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  };
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', tones[tone])}>{children}</span>;
}

export function MetricCard({ label, value, delta }: Readonly<{ label: string; value: string; delta?: string }>) {
  return (
    <Card className="space-y-2">
      <div className="text-sm text-muted">{label}</div>
      <div className="text-3xl font-semibold tracking-tight text-text">{value}</div>
      {delta ? <div className="text-sm text-accent">{delta}</div> : null}
    </Card>
  );
}
