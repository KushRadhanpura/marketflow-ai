import { CampaignTabs } from '@/components/tabs';
import { Card } from '@/components/ui';
import { getCampaignStrategy } from '@/lib/api';
import type { CampaignStrategy } from '@/types/api';

export default async function CampaignStrategyPage({ params }: Readonly<{ params: { id: string } }>) {
  const campaignId = Number(params.id);
  const strategy = await getCampaignStrategy(campaignId).catch(() => null as CampaignStrategy | null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <CampaignTabs campaignId={campaignId} activeTab="strategy" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h1 className="text-2xl font-semibold text-text">Strategy</h1>
          <p className="mt-3 text-muted">{strategy?.strategy ?? 'Strategy is not available yet.'}</p>
          <p className="mt-4 text-sm text-text">Positioning: {strategy?.positioning ?? 'Unavailable'}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-text">Channel strategy</h2>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-muted">{strategy ? JSON.stringify(strategy.channel_strategy, null, 2) : 'No strategy found.'}</pre>
        </Card>
      </div>
    </div>
  );
}
