import { CampaignTabs } from '@/components/tabs';
import { Badge, Card } from '@/components/ui';
import { getCampaignStrategy } from '@/lib/api';
import type { CampaignStrategy } from '@/types/api';

export const metadata = {
  title: 'Strategy',
};

export default async function CampaignStrategyPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  const campaignId = Number(params.id);
  const strategy = await getCampaignStrategy(campaignId).catch(
    () => null as CampaignStrategy | null,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <CampaignTabs campaignId={campaignId} activeTab="strategy" />

      {!strategy ? (
        <div className="rounded-xl border border-dashed border-line bg-panel px-8 py-16 text-center">
          <div className="text-sm font-semibold text-text">Strategy not available</div>
          <div className="mt-1 text-xs text-muted">
            Generate the campaign to build the strategy.
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main strategy + positioning */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                Strategy
              </div>
              <p className="text-sm leading-relaxed text-textSecondary">{strategy.strategy}</p>
            </Card>

            <Card>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                Positioning
              </div>
              <p className="text-sm leading-relaxed text-textSecondary">{strategy.positioning}</p>
            </Card>
          </div>

          {/* Content pillars + KPIs */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
                Content pillars
              </div>
              <ul className="space-y-2.5">
                {(strategy.content_pillars ?? []).map((pillar, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-accentSoft text-2xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="text-sm text-text">{pillar}</span>
                  </li>
                ))}
                {!(strategy.content_pillars?.length) && (
                  <li className="text-xs text-muted">No content pillars defined.</li>
                )}
              </ul>
            </Card>

            <Card>
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
                Key performance indicators
              </div>
              <ul className="space-y-2">
                {(strategy.kpis ?? []).map((kpi, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-sm text-text">{kpi}</span>
                  </li>
                ))}
                {!(strategy.kpis?.length) && (
                  <li className="text-xs text-muted">No KPIs defined.</li>
                )}
              </ul>
            </Card>
          </div>

          {/* Channel strategy */}
          <Card>
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
              Channel strategy
            </div>
            {Array.isArray(strategy.channel_strategy) && strategy.channel_strategy.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(strategy.channel_strategy as string[]).map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-line bg-bg p-3"
                  >
                    <p className="text-sm leading-relaxed text-text">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted">No channel strategy data available.</div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
