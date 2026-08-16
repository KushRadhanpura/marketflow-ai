import { CampaignTabs } from '@/components/tabs';
import { Card } from '@/components/ui';
import { getCampaignContent } from '@/lib/api';
import type { CampaignContentItem } from '@/types/api';

export default async function CampaignContentPage({ params }: Readonly<{ params: { id: string } }>) {
  const campaignId = Number(params.id);
  const contentItems = await getCampaignContent(campaignId).catch(() => [] as CampaignContentItem[]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <CampaignTabs campaignId={campaignId} activeTab="content" />
      <h1 className="mt-6 text-2xl font-semibold text-text">Content plan</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {contentItems.map((item) => (
          <Card key={`${item.day}-${item.channel}-${item.content_type}`}>
            <div className="text-sm font-semibold text-accent">Day {item.day}</div>
            <div className="mt-2 text-lg font-semibold text-text">{item.content_type}</div>
            <div className="mt-3 text-sm text-muted">{item.hook}</div>
            <div className="mt-4 text-sm leading-7 text-text">{item.caption}</div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">CTA</div>
            <div className="mt-1 text-sm text-muted">{item.cta}</div>
          </Card>
        ))}
        {!contentItems.length ? <Card>No content is available yet.</Card> : null}
      </div>
    </div>
  );
}
