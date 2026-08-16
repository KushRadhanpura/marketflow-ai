import Link from 'next/link';

import { Badge, Card } from '@/components/ui';
import { listCampaigns } from '@/lib/api';

export default async function CampaignsPage() {
  const campaigns = await listCampaigns().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Campaigns</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-text">All campaigns</h1>
        </div>
        <Link href="/campaigns/new" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft">
          New campaign
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {campaigns.map((campaign) => (
          <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-text">{campaign.name}</h2>
                  <p className="mt-2 text-sm text-muted">{campaign.objective}</p>
                </div>
                <Badge tone={campaign.status === 'active' ? 'success' : 'neutral'}>{campaign.status}</Badge>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-muted">
                <span>{campaign.duration} days</span>
                <span>Budget {campaign.budget}</span>
              </div>
            </Card>
          </Link>
        ))}
        {!campaigns.length ? <Card>No campaigns yet. Create the first one.</Card> : null}
      </div>
    </div>
  );
}
