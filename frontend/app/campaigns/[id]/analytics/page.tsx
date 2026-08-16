import { AnalyticsBarChart, ChannelBarChart } from '@/components/charts';
import { CampaignTabs } from '@/components/tabs';
import { Badge, Card, EmptyState, MetricCard } from '@/components/ui';
import { getCampaignAnalytics } from '@/lib/api';
import type { ChannelPerformance, ContentPerformance } from '@/types/api';

export const metadata = {
  title: 'Analytics',
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(Math.round(n));
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

function fmtCurrency(n: number): string {
  return `₹${n.toFixed(0)}`;
}

export default async function CampaignAnalyticsPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  const campaignId = Number(params.id);
  const analytics = await getCampaignAnalytics(campaignId).catch(() => null);

  const channelChartData =
    analytics?.channel_performance.map((ch) => ({
      channel: ch.channel,
      value: ch.engagements,
    })) ?? [];

  const channelEngRateData =
    analytics?.channel_performance.map((ch) => ({
      channel: ch.channel,
      value: ch.engagement_rate,
    })) ?? [];

  const contentChartData =
    analytics?.content_performance.map((cp) => ({
      channel: cp.label,
      value: cp.engagements,
    })) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <CampaignTabs campaignId={campaignId} activeTab="analytics" />

      {!analytics ? (
        <EmptyState
          title="Analytics not available"
          description="Generate the campaign to produce performance analytics."
        />
      ) : (
        <div className="space-y-8">
          {/* Best performers */}
          {(analytics.best_channel || analytics.best_content_type) && (
            <div className="flex flex-wrap items-center gap-3">
              {analytics.best_channel && (
                <div className="flex items-center gap-2 rounded-lg border border-successBg bg-successBg px-3 py-2">
                  <span className="text-xs text-muted">Best channel</span>
                  <Badge tone="success">{analytics.best_channel}</Badge>
                </div>
              )}
              {analytics.best_content_type && (
                <div className="flex items-center gap-2 rounded-lg border border-accentMuted bg-accentSoft px-3 py-2">
                  <span className="text-xs text-muted">Best content type</span>
                  <Badge tone="accent">{analytics.best_content_type}</Badge>
                </div>
              )}
              <div className="text-xs text-muted ml-1">From analytics engine</div>
            </div>
          )}

          {/* Primary KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Impressions"
              value={fmt(analytics.totals.impressions)}
            />
            <MetricCard
              label="Reach"
              value={fmt(analytics.totals.reach)}
            />
            <MetricCard
              label="Engagements"
              value={fmt(analytics.totals.engagements)}
            />
            <MetricCard
              label="Clicks"
              value={fmt(analytics.totals.clicks)}
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Engagement rate"
              value={fmtPct(analytics.totals.engagement_rate)}
              trend={analytics.totals.engagement_rate > 0.03 ? 'up' : 'neutral'}
              delta={analytics.totals.engagement_rate > 0.03 ? 'Above 3% benchmark' : undefined}
            />
            <MetricCard
              label="Click-through rate"
              value={fmtPct(analytics.totals.ctr)}
            />
            <MetricCard
              label="Conversions"
              value={fmt(analytics.totals.conversions)}
            />
            <MetricCard
              label="Cost per conversion"
              value={analytics.totals.cost_per_conversion > 0 ? fmtCurrency(analytics.totals.cost_per_conversion) : '—'}
            />
          </div>

          {/* Charts row */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="mb-4">
                <div className="text-sm font-semibold text-text">Channel engagements</div>
                <div className="mt-0.5 text-xs text-muted">Total engagements by channel</div>
              </div>
              <ChannelBarChart data={channelChartData} metric="Engagements" />
            </Card>

            <Card>
              <div className="mb-4">
                <div className="text-sm font-semibold text-text">Engagement rate by channel</div>
                <div className="mt-0.5 text-xs text-muted">Calculated by analytics engine</div>
              </div>
              <AnalyticsBarChart
                data={channelEngRateData}
                dataKey="value"
                nameKey="channel"
                formatter={(v) => fmtPct(v)}
                color="#0f766e"
              />
            </Card>
          </div>

          {/* Channel comparison table */}
          {analytics.channel_performance.length > 0 && (
            <Card padding="none">
              <div className="border-b border-line px-5 py-4">
                <div className="text-sm font-semibold text-text">Channel breakdown</div>
                <div className="mt-0.5 text-xs text-muted">
                  Detailed performance metrics per channel
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-line">
                      {['Channel', 'Impressions', 'Reach', 'Engagements', 'Eng. Rate', 'CTR', 'Conversions', 'Spend'].map(
                        (col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-muted"
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {analytics.channel_performance.map((ch: ChannelPerformance) => (
                      <tr key={ch.channel} className="hover:bg-panelAlt transition">
                        <td className="px-4 py-3 font-medium text-text">{ch.channel}</td>
                        <td className="px-4 py-3 text-muted">{fmt(ch.impressions)}</td>
                        <td className="px-4 py-3 text-muted">{fmt(ch.reach)}</td>
                        <td className="px-4 py-3 text-muted">{fmt(ch.engagements)}</td>
                        <td className="px-4 py-3 text-muted">{fmtPct(ch.engagement_rate)}</td>
                        <td className="px-4 py-3 text-muted">{fmtPct(ch.ctr)}</td>
                        <td className="px-4 py-3 text-muted">{fmt(ch.conversions)}</td>
                        <td className="px-4 py-3 text-muted">{fmtCurrency(ch.spend)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Content performance table */}
          {analytics.content_performance.length > 0 && (
            <Card padding="none">
              <div className="border-b border-line px-5 py-4">
                <div className="text-sm font-semibold text-text">Content performance</div>
                <div className="mt-0.5 text-xs text-muted">Performance by content type</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-line">
                      {['Content type', 'Impressions', 'Engagements', 'Clicks', 'Conversions', 'Eng. Rate', 'Spend'].map(
                        (col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-muted"
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {analytics.content_performance.map((cp: ContentPerformance) => (
                      <tr key={cp.label} className="hover:bg-panelAlt transition">
                        <td className="px-4 py-3 font-medium text-text">{cp.label}</td>
                        <td className="px-4 py-3 text-muted">{fmt(cp.impressions)}</td>
                        <td className="px-4 py-3 text-muted">{fmt(cp.engagements)}</td>
                        <td className="px-4 py-3 text-muted">{fmt(cp.clicks)}</td>
                        <td className="px-4 py-3 text-muted">{fmt(cp.conversions)}</td>
                        <td className="px-4 py-3 text-muted">{fmtPct(cp.engagement_rate)}</td>
                        <td className="px-4 py-3 text-muted">{fmtCurrency(cp.spend)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Total spend */}
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Total spend"
              value={fmtCurrency(analytics.totals.spend)}
            />
            <MetricCard
              label="Conversion rate"
              value={fmtPct(analytics.totals.conversion_rate)}
            />
            <MetricCard
              label="ROI"
              value={analytics.totals.roi > 0 ? `${analytics.totals.roi.toFixed(1)}x` : '—'}
              trend={analytics.totals.roi > 1 ? 'up' : analytics.totals.roi > 0 ? 'neutral' : 'down'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
