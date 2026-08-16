import { CampaignWizard } from './campaign-wizard';

export const metadata = {
  title: 'New Campaign',
};

export default function NewCampaignPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">
          New campaign
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Campaign brief</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Step through the brief, confirm your settings, and generate the full campaign workflow.
        </p>
      </div>
      <CampaignWizard />
    </div>
  );
}
