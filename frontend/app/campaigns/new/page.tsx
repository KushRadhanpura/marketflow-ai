import { CampaignWizard } from './campaign-wizard';

export default function NewCampaignPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Create campaign</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-text">Build a campaign brief</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Step through the business brief, objective, channels, and review flow. When you generate, the backend creates the campaign and runs the agentic workflow.
        </p>
      </div>
      <CampaignWizard />
    </div>
  );
}
