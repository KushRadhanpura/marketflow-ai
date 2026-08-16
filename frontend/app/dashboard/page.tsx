import Link from 'next/link';

import { ChannelBarChart, PerformanceLineChart } from '@/components/charts';
import { Badge, Card, MetricCard } from '@/components/ui';
import { getDashboardSummary } from '@/lib/api';

export default async function DashboardPage() {
  const summary = await getDashboardSummary().catch(() => null);

  const channelData = summary?.channel_performance.map((channel) => ({
    channel: channel.channel,
    value: channel.engagements,
  })) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Dashboard</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-text">Campaign performance and optimization</h1>
        </div>
        <Link href="/campaigns/new" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft">
          Create Campaign
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active Campaigns" value={String(summary?.active_campaigns ?? 0)} />
        <MetricCard label="Total Reach" value={String(summary?.totals.reach ?? 0)} />
        <MetricCard label="Engagement Rate" value={`${((summary?.totals.engagement_rate ?? 0) * 100).toFixed(1)}%`} />
        <MetricCard label="Conversions" value={String(summary?.totals.conversions ?? 0)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text">Performance over time</h2>
              <p className="text-sm text-muted">Demo campaign trend from seeded data.</p>
            </div>
            <Badge tone="success">Live data</Badge>
          </div>
          <PerformanceLineChart />
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-text">Channel performance</h2>
            <p className="text-sm text-muted">Backend-calculated channel engagement from the current demo set.</p>
          </div>
          <ChannelBarChart data={channelData} />
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-lg font-semibold text-text">Recent recommendations</h2>
          <div className="mt-4 space-y-3">
            {(summary?.recent_recommendations ?? []).map((item) => (
              <div key={item.id} className="rounded-2xl border border-line p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-text">{item.title}</div>
                    <div className="mt-1 text-sm text-muted">{item.description}</div>
                  </div>
                  <Badge tone={item.priority === 'high' ? 'warning' : 'neutral'}>{item.priority}</Badge>
                </div>
              </div>
            ))}
            {!(summary?.recent_recommendations?.length) ? <div className="text-sm text-muted">No recommendations yet.</div> : null}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text">Recent campaigns</h2>
          <div className="mt-4 space-y-3">
            {(summary?.recent_campaigns ?? []).map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="block rounded-2xl border border-line p-4 transition hover:bg-panel-alt">
                <div className="text-sm font-semibold text-text">{campaign.name}</div>
                <div className="mt-1 text-sm text-muted">{campaign.objective}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span>{campaign.duration} days</span>
                  <Badge tone={campaign.status === 'active' ? 'success' : 'neutral'}>{campaign.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
