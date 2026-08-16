import Link from 'next/link';

import { CampaignTabs } from '@/components/tabs';
import { Badge, Card } from '@/components/ui';
import { getCampaign } from '@/lib/api';

export default async function CampaignDetailPage({ params }: Readonly<{ params: { id: string } }>) {
  const { id } = params;
  const campaign = await getCampaign(Number(id)).catch(() => null);

  if (!campaign) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Card>Campaign not found.</Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Campaign</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-text">{campaign.name}</h1>
          <p className="mt-3 text-muted">{campaign.objective}</p>
        </div>
        <Badge tone={campaign.status === 'active' ? 'success' : 'neutral'}>{campaign.status}</Badge>
      </div>
      <CampaignTabs campaignId={campaign.id} activeTab="overview" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="text-sm text-muted">Duration</div>
          <div className="mt-2 text-2xl font-semibold">{campaign.duration} days</div>
        </Card>
        <Card>
          <div className="text-sm text-muted">Budget</div>
          <div className="mt-2 text-2xl font-semibold">{campaign.budget}</div>
        </Card>
        <Card>
          <div className="text-sm text-muted">Status</div>
          <div className="mt-2 text-2xl font-semibold capitalize">{campaign.status}</div>
        </Card>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-text">Why this campaign exists</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{campaign.objective}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-text">Quick links</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/campaigns/${campaign.id}/strategy`} className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-semibold text-text">Strategy</Link>
            <Link href={`/campaigns/${campaign.id}/content`} className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-semibold text-text">Content</Link>
            <Link href={`/campaigns/${campaign.id}/analytics`} className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-semibold text-text">Analytics</Link>
            <Link href={`/campaigns/${campaign.id}/recommendations`} className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-semibold text-text">Recommendations</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
