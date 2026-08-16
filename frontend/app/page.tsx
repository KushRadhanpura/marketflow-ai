import Link from 'next/link';

import { Card } from '@/components/ui';

const differentiator = [
  'Goal',
  'Strategy',
  'Content',
  'Campaign',
  'Analytics',
  'Optimization',
  'Next Campaign',
];

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-line bg-panel px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            MarketFlow AI for SMB marketing ops
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-text sm:text-6xl">
            Your AI Marketing Team for Smarter Campaigns
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            Plan campaigns, generate content, understand performance, and continuously improve your marketing workflow with AI agents.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-95">
              Open Dashboard
            </Link>
            <Link href="/campaigns/new" className="inline-flex items-center rounded-full border border-line bg-panel px-6 py-3 text-sm font-semibold text-text transition hover:bg-panel-alt">
              Create Campaign
            </Link>
          </div>
        </div>
        <Card className="space-y-5 bg-panel/95">
          <div className="text-sm font-semibold text-muted">Traditional AI tool</div>
          <div className="rounded-2xl bg-panel-alt px-4 py-3 text-sm text-text">Prompt → Content</div>
          <div className="text-sm font-semibold text-muted">MarketFlow AI</div>
          <div className="grid gap-2">
            {differentiator.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">{index + 1}</span>
                <span className="text-sm font-medium text-text">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
