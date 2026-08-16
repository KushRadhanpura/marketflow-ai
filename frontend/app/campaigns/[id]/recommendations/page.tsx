import { CampaignTabs } from '@/components/tabs';
import { Badge, Card } from '@/components/ui';
import { getCampaignRecommendations } from '@/lib/api';
import type { CampaignRecommendation } from '@/types/api';

export default async function CampaignRecommendationsPage({ params }: Readonly<{ params: { id: string } }>) {
  const campaignId = Number(params.id);
  const recommendations = await getCampaignRecommendations(campaignId).catch(() => [] as CampaignRecommendation[]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <CampaignTabs campaignId={campaignId} activeTab="recommendations" />
      <h1 className="mt-6 text-2xl font-semibold text-text">AI recommendations</h1>
      <div className="mt-6 grid gap-4">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-text">{recommendation.title}</div>
                <div className="mt-2 text-sm text-muted">{recommendation.description}</div>
                <div className="mt-3 text-sm text-text">Reason: {recommendation.reason}</div>
              </div>
              <Badge tone={recommendation.priority === 'high' ? 'warning' : 'neutral'}>{recommendation.priority}</Badge>
            </div>
          </Card>
        ))}
        {!recommendations.length ? <Card>No recommendations yet.</Card> : null}
      </div>
    </div>
  );
}
