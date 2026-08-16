import Link from 'next/link';

import { CampaignTabs } from '@/components/tabs';
import { Badge, Button, Card, DataRow, Divider } from '@/components/ui';
import { getCampaign } from '@/lib/api';

function formatBudget(budget: number): string {
  if (budget >= 1_000) return `₹${(budget / 1_000).toFixed(0)}k`;
  return `₹${budget}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function CampaignDetailPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  const { id } = params;
  const campaign = await getCampaign(Number(id)).catch(() => null);

  if (!campaign) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Card>
          <div className="text-center py-8">
            <div className="text-sm font-semibold text-text mb-1">Campaign not found</div>
            <div className="text-xs text-muted mb-4">
              This campaign may have been deleted or the ID is invalid.
            </div>
            <Link href="/campaigns">
              <Button variant="secondary" size="sm">
                Back to campaigns
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Campaign header */}
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <Link
            href="/campaigns"
            className="text-xs text-muted hover:text-text transition"
          >
            Campaigns
          </Link>
          <span className="text-xs text-muted">/</span>
          <span className="text-xs text-muted truncate max-w-xs">{campaign.name}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text">{campaign.name}</h1>
            <p className="mt-1 text-sm text-muted max-w-2xl">{campaign.objective}</p>
          </div>
          <Badge
            tone={campaign.status === 'active' ? 'success' : 'neutral'}
            dot
          >
            {campaign.status}
          </Badge>
        </div>
      </div>

      <CampaignTabs campaignId={campaign.id} activeTab="overview" />

      {/* Overview content */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Campaign details */}
        <div className="space-y-6">
          <Card>
            <div className="mb-4 text-sm font-semibold text-text">Campaign details</div>
            <div className="divide-y divide-line">
              <DataRow label="Status" value={
                <Badge tone={campaign.status === 'active' ? 'success' : 'neutral'} dot>
                  {campaign.status}
                </Badge>
              } />
              <DataRow label="Duration" value={`${campaign.duration} days`} />
              <DataRow label="Budget" value={formatBudget(campaign.budget)} />
              <DataRow label="Created" value={formatDate(campaign.created_at)} />
            </div>
          </Card>

          <Card>
            <div className="mb-3 text-sm font-semibold text-text">Objective</div>
            <p className="text-sm leading-relaxed text-muted">{campaign.objective}</p>
          </Card>
        </div>

        {/* Quick navigation */}
        <div className="space-y-4">
          <Card>
            <div className="mb-4 text-sm font-semibold text-text">Campaign sections</div>
            <div className="space-y-1.5">
              {[
                { href: 'strategy', label: 'Strategy', desc: 'Positioning and content pillars' },
                { href: 'content', label: 'Content plan', desc: 'Day-by-day content calendar' },
                { href: 'analytics', label: 'Analytics', desc: 'Performance metrics and breakdown' },
                { href: 'recommendations', label: 'Insights', desc: 'Optimization recommendations' },
              ].map((section) => (
                <Link
                  key={section.href}
                  href={`/campaigns/${campaign.id}/${section.href}`}
                  className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 transition hover:bg-panelAlt group"
                >
                  <div>
                    <div className="text-sm font-medium text-text">{section.label}</div>
                    <div className="text-xs text-muted">{section.desc}</div>
                  </div>
                  <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-3 text-sm font-semibold text-text">Workflow status</div>
            <div className="space-y-2">
              {[
                'Business analysis',
                'Strategy development',
                'Content planning',
                'Campaign setup',
                'Analytics ready',
              ].map((step) => (
                <div key={step} className="flex items-center gap-2.5">
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-successBg">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M1.5 4L3 5.5L6.5 2"
                        stroke="#16a34a"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-xs text-text">{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
