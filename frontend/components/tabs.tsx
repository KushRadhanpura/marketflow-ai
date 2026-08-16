import Link from 'next/link';

import { cn } from '@/lib/utils';

const tabItems = [
  { href: 'strategy', label: 'Strategy' },
  { href: 'content', label: 'Content' },
  { href: 'analytics', label: 'Analytics' },
  { href: 'recommendations', label: 'Recommendations' },
];

export function CampaignTabs({ campaignId, activeTab }: Readonly<{ campaignId: number; activeTab: string }>) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-line bg-panel p-2">
      <Link href={`/campaigns/${campaignId}`} className={cn('rounded-full px-4 py-2 text-sm font-semibold transition', activeTab === 'overview' ? 'bg-accent text-white' : 'text-muted hover:bg-panel-alt hover:text-text')}>
        Overview
      </Link>
      {tabItems.map((tab) => (
        <Link
          key={tab.href}
          href={`/campaigns/${campaignId}/${tab.href}`}
          className={cn('rounded-full px-4 py-2 text-sm font-semibold transition', activeTab === tab.href ? 'bg-accent text-white' : 'text-muted hover:bg-panel-alt hover:text-text')}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
