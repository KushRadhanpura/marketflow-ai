'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';

const navMain = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    href: '/campaigns',
    label: 'Campaigns',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/campaigns/new',
    label: 'New Campaign',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="6.3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    accent: true,
  },
];

const navSecondary = [
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

function NavItem({
  href,
  label,
  icon,
  accent,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  accent?: boolean;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-accent text-white'
          : accent
            ? 'border border-line bg-panel text-text hover:bg-panelAlt'
            : 'text-muted hover:bg-panelAlt hover:text-text',
      )}
    >
      <span className={cn('flex-shrink-0', active ? 'text-white/80' : 'text-muted')}>{icon}</span>
      {label}
    </Link>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/campaigns/new') return pathname === '/campaigns/new';
    if (href === '/campaigns') return pathname.startsWith('/campaigns') && pathname !== '/campaigns/new';
    return pathname === href;
  }

  return (
    <aside className="flex h-full w-sidebar flex-col border-r border-line bg-panel">
      {/* Logo */}
      <div className="flex h-topbar flex-shrink-0 items-center gap-3 border-b border-line px-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
            MF
          </span>
          <div>
            <div className="text-sm font-semibold text-text leading-tight">MarketFlow</div>
            <div className="text-2xs text-muted leading-tight">Marketing Ops</div>
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3">
        {navMain.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} onClick={onClose} />
        ))}
      </nav>

      {/* Secondary nav */}
      <div className="border-t border-line px-3 py-3">
        {navSecondary.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} onClick={onClose} />
        ))}
      </div>
    </aside>
  );
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  // Landing page gets full-width layout
  if (isLandingPage) {
    return (
      <div className="min-h-screen text-text">
        <header className="sticky top-0 z-30 border-b border-line bg-panel/90 backdrop-blur-md">
          <div className="mx-auto flex h-topbar w-full max-w-7xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
                MF
              </span>
              <span className="text-sm font-semibold text-text">MarketFlow</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted transition hover:text-text"
              >
                Dashboard
              </Link>
              <Link
                href="/campaigns/new"
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen text-text">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-sidebar md:flex-shrink-0 md:flex-col md:fixed md:inset-y-0 md:z-20">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-text/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-sidebar">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-sidebar">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-30 flex h-topbar items-center border-b border-line bg-panel/90 backdrop-blur-md px-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="mr-3 rounded-md p-1.5 text-muted hover:bg-panelAlt hover:text-text"
            aria-label="Open navigation"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
              MF
            </span>
            <span className="text-sm font-semibold text-text">MarketFlow</span>
          </Link>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
