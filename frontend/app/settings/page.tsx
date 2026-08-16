import { Card, DataRow, Divider, MetricCard, SectionHeader } from '@/components/ui';

export const metadata = {
  title: 'Settings',
};

const envItems = [
  {
    label: 'API base URL',
    var: 'NEXT_PUBLIC_API_URL',
    desc: 'Frontend reads campaign, dashboard, and analytics data from this backend endpoint.',
    default: 'http://localhost:8000/api',
  },
  {
    label: 'LLM provider key',
    var: 'LLM_API_KEY',
    desc: 'Used by the backend when structured generation is enabled.',
    default: 'See backend .env',
  },
  {
    label: 'Database URL',
    var: 'DATABASE_URL',
    desc: 'PostgreSQL for production; SQLite for local development.',
    default: 'sqlite:///./marketflow.db',
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <SectionHeader title="Settings" subtitle="Environment configuration and system status" />
      </div>

      {/* Status cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Backend" value="FastAPI" subtitle="Python + LangGraph" />
        <MetricCard label="Database" value="SQLite" subtitle="PostgreSQL-compatible" />
        <MetricCard label="Demo data" value="Seeded" subtitle="3 campaigns available" />
      </div>

      {/* Environment variables */}
      <Card>
        <div className="mb-4 text-sm font-semibold text-text">Environment variables</div>
        <div className="space-y-4">
          {envItems.map((item, i) => (
            <div key={item.var}>
              {i > 0 && <Divider className="mb-4" />}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-text">{item.label}</div>
                  <div className="mt-0.5 text-xs text-muted">{item.desc}</div>
                </div>
                <div className="flex-shrink-0 rounded-md bg-panelAlt px-3 py-1.5 font-mono text-xs text-textSecondary">
                  {item.var}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted">
                Default: <code className="rounded bg-panelAlt px-1 py-0.5 text-2xs">{item.default}</code>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Workflow info */}
      <Card className="mt-6">
        <div className="mb-4 text-sm font-semibold text-text">Agentic workflow</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { step: 'Business agent', desc: 'Extracts business context, audience, and goals from the brief.' },
            { step: 'Strategy agent', desc: 'Defines positioning, content pillars, KPIs, and channel allocation.' },
            { step: 'Content agent', desc: 'Generates a day-by-day content calendar with hooks, captions, CTAs.' },
            { step: 'Planner agent', desc: 'Assembles the full campaign plan with channel-specific guidance.' },
            { step: 'Analytics agent', desc: 'Generates metrics using the Python analytics engine (no LLM).' },
            { step: 'Optimization agent', desc: 'Produces prioritized recommendations from data patterns.' },
          ].map((item) => (
            <div key={item.step} className="rounded-lg border border-line p-3">
              <div className="text-xs font-semibold text-text">{item.step}</div>
              <div className="mt-1 text-xs text-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
