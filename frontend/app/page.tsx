import Link from 'next/link';

const workflow = [
  {
    step: '01',
    label: 'Business Analysis',
    desc: 'Understand your business context, audience, and competitive landscape.',
  },
  {
    step: '02',
    label: 'Marketing Strategy',
    desc: 'Define positioning, content pillars, KPIs, and channel allocation.',
  },
  {
    step: '03',
    label: 'Content Planning',
    desc: 'Generate a day-by-day content calendar with hooks, captions, and CTAs.',
  },
  {
    step: '04',
    label: 'Campaign Build',
    desc: 'Assemble the full campaign plan with timing and channel breakdown.',
  },
  {
    step: '05',
    label: 'Analytics Setup',
    desc: 'Prepare performance metrics, channel tracking, and baseline projections.',
  },
  {
    step: '06',
    label: 'Optimization',
    desc: 'Generate prioritized recommendations based on data patterns.',
  },
];

const features = [
  {
    title: 'Full campaign workflow',
    desc: 'From business brief to optimized campaign — all in one run.',
  },
  {
    title: 'Deterministic analytics',
    desc: 'Performance metrics calculated by a dedicated Python engine, not estimated by a language model.',
  },
  {
    title: 'Actionable recommendations',
    desc: 'Evidence-based insights with clear next actions, not generic advice.',
  },
  {
    title: 'Multi-channel planning',
    desc: 'Instagram, WhatsApp, LinkedIn, and more — with channel-specific content strategies.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-24">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-1.5 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Built for SMB marketing operations
          </div>
          <h1 className="mb-5 text-5xl font-semibold tracking-tight text-text leading-[1.1]">
            Your marketing ops platform
            <br />
            <span className="text-accent">for smarter campaigns</span>
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-muted">
            Plan, generate, and analyze full marketing campaigns using an agentic workflow that goes from
            business brief to optimized content — without back-and-forth prompting.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:brightness-110"
            >
              Open dashboard
            </Link>
            <Link
              href="/campaigns/new"
              className="rounded-md border border-line bg-panel px-5 py-2.5 text-sm font-semibold text-text shadow-xs transition hover:bg-panelAlt"
            >
              Create a campaign
            </Link>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="border-t border-line bg-panel">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
            How it works
          </div>
          <h2 className="mb-10 text-2xl font-semibold text-text">
            Not a prompt tool. A full campaign workflow.
          </h2>

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-bg p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
                Traditional AI tool
              </div>
              <div className="flex items-center gap-3 text-sm text-text">
                <span className="rounded bg-panelAlt px-2.5 py-1 font-medium">Prompt</span>
                <span className="text-muted">→</span>
                <span className="rounded bg-panelAlt px-2.5 py-1 font-medium">Content</span>
              </div>
            </div>
            <div className="rounded-lg border border-accent/20 bg-accentSoft/30 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
                MarketFlow
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {['Goal', 'Strategy', 'Content', 'Analytics', 'Insights'].map((item, i, arr) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="rounded bg-accentSoft px-2 py-0.5 text-xs font-semibold text-accent">
                      {item}
                    </span>
                    {i < arr.length - 1 && <span className="text-accent/50">→</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow steps */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workflow.map((item) => (
              <div key={item.step} className="rounded-lg border border-line bg-bg p-4">
                <div className="mb-2 text-xs font-bold text-muted">{item.step}</div>
                <div className="mb-1 text-sm font-semibold text-text">{item.label}</div>
                <div className="text-xs leading-relaxed text-muted">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
          Capabilities
        </div>
        <h2 className="mb-8 text-2xl font-semibold text-text">
          Designed for serious marketing work
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feat) => (
            <div key={feat.title} className="rounded-lg border border-line bg-panel p-5">
              <div className="mb-1.5 text-sm font-semibold text-text">{feat.title}</div>
              <div className="text-sm leading-relaxed text-muted">{feat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-semibold text-text">Ready to run your first campaign?</div>
              <div className="mt-1 text-sm text-muted">
                Demo data is pre-loaded. Create a campaign and see the full workflow in minutes.
              </div>
            </div>
            <Link
              href="/campaigns/new"
              className="flex-shrink-0 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:brightness-110"
            >
              Create campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
