import Link from 'next/link';

import { Badge, Button, Card, EmptyState, SectionHeader } from '@/components/ui';
import { listCampaigns } from '@/lib/api';

function formatBudget(budget: number): string {
  if (budget >= 1_000) return `₹${(budget / 1_000).toFixed(0)}k`;
  return `₹${budget}`;
}

export default async function CampaignsPage() {
  const campaigns = await listCampaigns().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <SectionHeader
          title="Campaigns"
          subtitle={`${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''} total`}
          action={
            <Link href="/campaigns/new">
              <Button variant="primary">New campaign</Button>
            </Link>
          }
        />
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Create your first campaign to kick off the agentic workflow and generate strategy, content, and analytics."
          action={
            <Link href="/campaigns/new">
              <Button variant="primary">Create campaign</Button>
            </Link>
          }
        />
      ) : (
        <Card padding="none">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-line px-5 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Campaign</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Status</div>
            <div className="hidden text-xs font-semibold uppercase tracking-wide text-muted sm:block">Duration</div>
            <div className="hidden text-xs font-semibold uppercase tracking-wide text-muted md:block">Budget</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              <span className="sr-only">Actions</span>
            </div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-line">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-4 transition hover:bg-panelAlt"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-text">{campaign.name}</div>
                  <div className="mt-0.5 truncate text-xs text-muted">{campaign.objective}</div>
                </div>
                <Badge
                  tone={campaign.status === 'active' ? 'success' : 'neutral'}
                  dot
                >
                  {campaign.status}
                </Badge>
                <div className="hidden text-xs text-muted sm:block">
                  {campaign.duration}d
                </div>
                <div className="hidden text-xs text-muted md:block">
                  {formatBudget(campaign.budget)}
                </div>
                <div className="text-xs font-medium text-accent">
                  View →
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
