import { Card, MetricCard } from '@/components/ui';

const environmentItems = [
  { label: 'API URL', value: 'NEXT_PUBLIC_API_URL', detail: 'Frontend reads campaign, dashboard, and analytics data from the backend.' },
  { label: 'LLM provider', value: 'LLM_API_KEY / LLM_MODEL', detail: 'Used by the backend provider abstraction when structured generation is enabled.' },
  { label: 'Database', value: 'DATABASE_URL', detail: 'Use PostgreSQL in production; SQLite is supported for local development.' },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Settings</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-text">Environment and integration settings</h1>
        <p className="mt-3 max-w-2xl text-muted">
          The MVP keeps configuration simple: environment variables drive the backend, and the frontend only needs the API base URL.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Backend status" value="Ready" delta="FastAPI + LangGraph" />
        <MetricCard label="Database mode" value="SQLite / PostgreSQL" delta="SQLite for local dev" />
        <MetricCard label="Demo mode" value="Enabled" delta="Seeded campaign data available" />
      </div>

      <div className="mt-8 grid gap-4">
        {environmentItems.map((item) => (
          <Card key={item.label}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-text">{item.label}</div>
                <div className="mt-1 text-sm text-muted">{item.detail}</div>
              </div>
              <div className="rounded-full bg-panel-alt px-4 py-2 text-sm font-semibold text-text">{item.value}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
