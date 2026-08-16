import { CampaignTabs } from '@/components/tabs';
import { Card, MetricCard } from '@/components/ui';
import { getCampaignAnalytics } from '@/lib/api';

export default async function CampaignAnalyticsPage({ params }: Readonly<{ params: { id: string } }>) {
  const campaignId = Number(params.id);
  const analytics = await getCampaignAnalytics(campaignId).catch(() => null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <CampaignTabs campaignId={campaignId} activeTab="analytics" />
      <h1 className="mt-6 text-2xl font-semibold text-text">Analytics</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Impressions" value={String(analytics?.totals.impressions ?? 0)} />
        <MetricCard label="Reach" value={String(analytics?.totals.reach ?? 0)} />
        <MetricCard label="CTR" value={`${((analytics?.totals.ctr ?? 0) * 100).toFixed(1)}%`} />
        <MetricCard label="Conversions" value={String(analytics?.totals.conversions ?? 0)} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-text">Channel comparison</h2>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-muted">{analytics ? JSON.stringify(analytics.channel_performance, null, 2) : 'No analytics yet.'}</pre>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-text">Content comparison</h2>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-muted">{analytics ? JSON.stringify(analytics.content_performance, null, 2) : 'No analytics yet.'}</pre>
        </Card>
      </div>
    </div>
  );
}
