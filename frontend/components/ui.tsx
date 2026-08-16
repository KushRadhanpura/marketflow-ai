import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

// ─── Button ──────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg';
  }
>) {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-white hover:brightness-110 shadow-xs',
    secondary: 'border border-line bg-panel text-text hover:bg-panelAlt shadow-xs',
    ghost: 'text-muted hover:bg-panelAlt hover:text-text',
    danger: 'bg-dangerBg text-danger border border-danger/20 hover:bg-red-100',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  children,
  className,
  padding = 'md',
}: Readonly<{
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}>) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };
  return (
    <div
      className={cn(
        'rounded-xl border border-line bg-panel shadow-xs',
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

export function Badge({
  children,
  tone = 'neutral',
  dot,
}: Readonly<{
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
}>) {
  const tones: Record<BadgeTone, string> = {
    neutral: 'bg-panelAlt text-muted',
    success: 'bg-successBg text-success',
    warning: 'bg-warningBg text-warning',
    danger: 'bg-dangerBg text-danger',
    accent: 'bg-accentSoft text-accent',
  };
  const dotTones: Record<BadgeTone, string> = {
    neutral: 'bg-muted',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    accent: 'bg-accent',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium',
        tones[tone],
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', dotTones[tone])} />}
      {children}
    </span>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

export function MetricCard({
  label,
  value,
  delta,
  trend,
  subtitle,
}: Readonly<{
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}>) {
  return (
    <Card className="flex flex-col gap-1">
      <div className="text-xs font-medium text-muted uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-semibold tracking-tight text-text">{value}</div>
      {(delta || subtitle) && (
        <div className={cn('text-xs font-medium', trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted')}>
          {trend === 'up' && '↑ '}
          {trend === 'down' && '↓ '}
          {delta || subtitle}
        </div>
      )}
    </Card>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: Readonly<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}>) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  action,
}: Readonly<{
  title: string;
  description?: string;
  action?: ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-panel px-8 py-16 text-center">
      <div className="text-sm font-medium text-text">{title}</div>
      {description && <p className="mt-1 text-xs text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton h-4 w-full', className)} />;
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-line', className)} />;
}

// ─── DataRow ──────────────────────────────────────────────────────────────────

export function DataRow({
  label,
  value,
  className,
}: Readonly<{
  label: string;
  value: ReactNode;
  className?: string;
}>) {
  return (
    <div className={cn('flex items-start justify-between gap-4 py-2.5', className)}>
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-text text-right">{value}</span>
    </div>
  );
}
