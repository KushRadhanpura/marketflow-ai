import { CampaignTabs } from '@/components/tabs';
import { Badge, Card, EmptyState } from '@/components/ui';
import { getCampaignContent } from '@/lib/api';
import type { CampaignContentItem } from '@/types/api';

export const metadata = {
  title: 'Content',
};

const CHANNEL_COLORS: Record<string, string> = {
  Instagram: 'bg-pink-50 text-pink-700 border-pink-200',
  WhatsApp: 'bg-green-50 text-green-700 border-green-200',
  LinkedIn: 'bg-blue-50 text-blue-700 border-blue-200',
  Facebook: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Twitter: 'bg-sky-50 text-sky-700 border-sky-200',
  YouTube: 'bg-red-50 text-red-700 border-red-200',
};

function channelClass(channel: string): string {
  return CHANNEL_COLORS[channel] ?? 'bg-panelAlt text-muted border-line';
}

export default async function CampaignContentPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  const campaignId = Number(params.id);
  const contentItems = await getCampaignContent(campaignId).catch(
    () => [] as CampaignContentItem[],
  );

  // Group by day
  const byDay = contentItems.reduce<Record<number, CampaignContentItem[]>>((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  const sortedDays = Object.keys(byDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <CampaignTabs campaignId={campaignId} activeTab="content" />

      {/* Summary bar */}
      {contentItems.length > 0 && (
        <div className="mb-6 flex items-center gap-6 text-xs text-muted">
          <span>
            <span className="font-semibold text-text">{contentItems.length}</span> content items
          </span>
          <span>
            <span className="font-semibold text-text">{sortedDays.length}</span> days
          </span>
          <span>
            <span className="font-semibold text-text">
              {[...new Set(contentItems.map((i) => i.channel))].length}
            </span>{' '}
            channels
          </span>
        </div>
      )}

      {contentItems.length === 0 ? (
        <EmptyState
          title="No content plan yet"
          description="Generate the campaign to build the content calendar."
        />
      ) : (
        <div className="space-y-8">
          {sortedDays.map((day) => (
            <div key={day}>
              {/* Day header */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
                  {day}
                </div>
                <div>
                  <span className="text-sm font-semibold text-text">Day {day}</span>
                  <span className="ml-2 text-xs text-muted">
                    {byDay[day].length} item{byDay[day].length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Content items for this day */}
              <div className="grid gap-4 lg:grid-cols-2">
                {byDay[day].map((item) => (
                  <Card
                    key={`${item.day}-${item.channel}-${item.content_type}`}
                    className="flex flex-col gap-4"
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={[
                            'rounded-md border px-2 py-0.5 text-xs font-medium',
                            channelClass(item.channel),
                          ].join(' ')}
                        >
                          {item.channel}
                        </span>
                        <span className="rounded-md bg-panelAlt px-2 py-0.5 text-xs font-medium text-muted">
                          {item.content_type}
                        </span>
                      </div>
                      {item.status && (
                        <Badge
                          tone={
                            item.status === 'published'
                              ? 'success'
                              : item.status === 'draft'
                                ? 'neutral'
                                : 'neutral'
                          }
                          dot
                        >
                          {item.status}
                        </Badge>
                      )}
                    </div>

                    {/* Objective */}
                    <div>
                      <div className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-muted">
                        Objective
                      </div>
                      <div className="text-xs text-textSecondary">{item.objective}</div>
                    </div>

                    {/* Hook */}
                    <div>
                      <div className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-muted">
                        Hook
                      </div>
                      <div className="text-sm font-medium italic text-text">
                        &ldquo;{item.hook}&rdquo;
                      </div>
                    </div>

                    {/* Caption */}
                    <div>
                      <div className="mb-0.5 text-2xs font-semibold uppercase tracking-widest text-muted">
                        Caption
                      </div>
                      <div className="text-sm leading-relaxed text-textSecondary">{item.caption}</div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-start gap-2 rounded-lg bg-accentSoft px-3 py-2">
                      <div className="text-2xs font-bold uppercase tracking-widest text-accent mt-0.5">
                        CTA
                      </div>
                      <div className="text-xs font-medium text-accent">{item.cta}</div>
                    </div>

                    {/* Creative brief */}
                    {item.creative_brief && (
                      <details className="group">
                        <summary className="cursor-pointer text-2xs font-semibold uppercase tracking-widest text-muted hover:text-text transition list-none flex items-center gap-1">
                          <svg
                            className="h-3 w-3 transition group-open:rotate-90"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M4.5 2.5L7.5 6L4.5 9.5"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Creative brief
                        </summary>
                        <div className="mt-2 text-xs leading-relaxed text-muted">
                          {item.creative_brief}
                        </div>
                      </details>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
