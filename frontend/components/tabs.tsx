'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const tabItems = [
  { href: '', label: 'Overview' },
  { href: 'strategy', label: 'Strategy' },
  { href: 'content', label: 'Content' },
  { href: 'analytics', label: 'Analytics' },
  { href: 'recommendations', label: 'Insights' },
];

export function CampaignTabs({ campaignId, activeTab }: Readonly<{ campaignId: number; activeTab: string }>) {
  const pathname = usePathname();

  return (
    <div className="mb-6 border-b border-line">
      <nav className="-mb-px flex gap-0 overflow-x-auto" aria-label="Campaign sections">
        {tabItems.map((tab) => {
          const isActive = activeTab === (tab.href || 'overview');
          const href = tab.href
            ? `/campaigns/${campaignId}/${tab.href}`
            : `/campaigns/${campaignId}`;
          return (
            <Link
              key={tab.href || 'overview'}
              href={href}
              className={cn(
                'flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:border-line hover:text-text',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
