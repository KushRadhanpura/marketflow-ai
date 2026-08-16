import Link from 'next/link';

import { ChannelBarChart, PerformanceLineChart } from '@/components/charts';
import { Badge, Button, Card, EmptyState, MetricCard, SectionHeader } from '@/components/ui';
import { getDashboardSummary } from '@/lib/api';

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function formatCurrency(n: number): string {
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}k`;
  return `₹${n}`;
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary().catch(() => null);

  const channelData =
    summary?.channel_performance.map((ch) => ({
      channel: ch.channel,
      value: ch.engagements,
    })) ?? [];

  const totals = summary?.totals;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <SectionHeader
          title="Overview"
          subtitle={`${summary?.active_campaigns ?? 0} active campaign${(summary?.active_campaigns ?? 0) !== 1 ? 's' : ''}`}
          action={
            <Link href="/campaigns/new">
              <Button variant="primary" size="md">
                New campaign
              </Button>
            </Link>
          }
        />
      </div>

      {/* KPI row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total impressions"
          value={formatNumber(totals?.impressions ?? 0)}
          subtitle="Across all campaigns"
        />
        <MetricCard
          label="Total reach"
          value={formatNumber(totals?.reach ?? 0)}
          subtitle="Unique users"
        />
        <MetricCard
          label="Engagement rate"
          value={`${((totals?.engagement_rate ?? 0) * 100).toFixed(1)}%`}
          trend={((totals?.engagement_rate ?? 0) * 100) > 3 ? 'up' : 'neutral'}
          delta={((totals?.engagement_rate ?? 0) * 100) > 3 ? 'Above 3% benchmark' : undefined}
        />
        <MetricCard
          label="Conversions"
          value={formatNumber(totals?.conversions ?? 0)}
          subtitle={totals?.cost_per_conversion ? `₹${totals.cost_per_conversion.toFixed(0)} per conversion` : undefined}
        />
      </div>

      {/* Charts row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-text">Campaign performance</div>
              <div className="mt-0.5 text-xs text-muted">Impressions and engagements over campaign duration</div>
            </div>
            <Badge tone="success" dot>
              From analytics engine
            </Badge>
          </div>
          <PerformanceLineChart />
        </Card>

        <Card>
          <div className="mb-4">
            <div className="text-sm font-semibold text-text">Channel engagement</div>
            <div className="mt-0.5 text-xs text-muted">
              {channelData.length > 0
                ? `${channelData.length} channel${channelData.length > 1 ? 's' : ''} tracked`
                : 'Calculated from campaign metrics'}
            </div>
          </div>
          <ChannelBarChart data={channelData} metric="Engagements" />
        </Card>
      </div>

      {/* Bottom section: Campaigns + Insights */}
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Recent campaigns */}
        <Card padding="none">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="text-sm font-semibold text-text">Recent campaigns</div>
            <Link
              href="/campaigns"
              className="text-xs font-medium text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          {(summary?.recent_campaigns ?? []).length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No campaigns yet"
                description="Create your first campaign to get started."
                action={
                  <Link href="/campaigns/new">
                    <Button variant="secondary" size="sm">
                      New campaign
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-line">
              {(summary?.recent_campaigns ?? []).map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition hover:bg-panelAlt"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-text">{campaign.name}</div>
                    <div className="mt-0.5 truncate text-xs text-muted">{campaign.objective}</div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0 items-center gap-3">
                    <div className="text-right text-xs text-muted">
                      <div className="font-medium">{campaign.duration}d</div>
                    </div>
                    <Badge
                      tone={campaign.status === 'active' ? 'success' : 'neutral'}
                      dot
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* AI Insights */}
        <Card padding="none">
          <div className="border-b border-line px-5 py-4">
            <div className="text-sm font-semibold text-text">Recent insights</div>
            <div className="mt-0.5 text-xs text-muted">From the optimization workflow</div>
          </div>
          {(summary?.recent_recommendations ?? []).length === 0 ? (
            <div className="p-6">
              <div className="text-xs text-muted">
                Run a campaign to generate optimization insights.
              </div>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {(summary?.recent_recommendations ?? []).map((item) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <div className="text-sm font-medium text-text leading-snug">{item.title}</div>
                    <Badge
                      tone={item.priority === 'high' ? 'warning' : item.priority === 'medium' ? 'neutral' : 'neutral'}
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <div className="text-xs leading-relaxed text-muted">{item.description}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Bottom KPIs row */}
      {totals && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Clicks"
            value={formatNumber(totals.clicks)}
          />
          <MetricCard
            label="Click-through rate"
            value={`${(totals.ctr * 100).toFixed(2)}%`}
          />
          <MetricCard
            label="Total spend"
            value={formatCurrency(totals.spend)}
          />
        </div>
      )}
    </div>
  );
}
