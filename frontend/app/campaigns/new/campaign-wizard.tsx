'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { createBusiness, createCampaign, generateCampaign } from '@/lib/api';
import { buildCampaignName, defaultWorkflowPreview, parseChannels } from '@/lib/campaign-form';
import { Badge, Card, MetricCard } from '@/components/ui';

const steps = ['Business', 'Audience', 'Goal', 'Budget & Duration', 'Channels', 'Review'];

export function CampaignWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<string[]>([]);
  const [form, setForm] = useState({
    businessName: 'Bean & Brew Café',
    category: 'Café',
    description: 'A neighborhood café serving students and young professionals.',
    audience: '18–25 year old college students in Ahmedabad',
    goal: 'Increase weekend orders',
    duration: 7,
    budget: 10000,
    channels: 'Instagram, WhatsApp',
    context: 'Focus on weekend traffic and student demand around the campus area.',
  });

  const selectedChannels = useMemo(
    () => parseChannels(form.channels),
    [form.channels],
  );

  const updateField = (key: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const next = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  const previous = () => setCurrentStep((step) => Math.max(step - 1, 0));

  const submit = () => {
    setError(null);
    setWorkflow([]);
    startTransition(async () => {
      try {
        setWorkflow(['Understanding business']);
        const business = await createBusiness({
          name: form.businessName,
          category: form.category,
          description: form.description,
          target_audience: form.audience,
        });
        setWorkflow((items) => [...items, 'Creating campaign']);
        const campaign = await createCampaign({
          business_id: business.id,
          name: buildCampaignName(form.businessName, form.goal),
          objective: form.goal,
          duration: form.duration,
          budget: form.budget,
        });
        setWorkflow((items) => [...items, 'Generating strategy', 'Generating content', 'Preparing analytics', 'Building recommendations']);
        await generateCampaign(campaign.id);
        router.push(`/campaigns/${campaign.id}`);
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : 'Unable to generate campaign.');
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <Badge key={step} tone={index === currentStep ? 'success' : 'neutral'}>
              {index + 1}. {step}
            </Badge>
          ))}
        </div>

        {currentStep === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business name" value={form.businessName} onChange={(value) => updateField('businessName', value)} />
            <Field label="Category" value={form.category} onChange={(value) => updateField('category', value)} />
            <div className="sm:col-span-2">
              <Field label="Description" value={form.description} onChange={(value) => updateField('description', value)} textarea />
            </div>
          </div>
        ) : null}

        {currentStep === 1 ? <Field label="Target audience" value={form.audience} onChange={(value) => updateField('audience', value)} textarea /> : null}
        {currentStep === 2 ? <Field label="Marketing goal" value={form.goal} onChange={(value) => updateField('goal', value)} textarea /> : null}

        {currentStep === 3 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Campaign duration" value={String(form.duration)} onChange={(value) => updateField('duration', Number(value))} />
            <Field label="Budget" value={String(form.budget)} onChange={(value) => updateField('budget', Number(value))} />
          </div>
        ) : null}

        {currentStep === 4 ? <Field label="Channels" value={form.channels} onChange={(value) => updateField('channels', value)} helperText="Separate channels with commas, for example: Instagram, WhatsApp" /> : null}

        {currentStep === 5 ? (
          <div className="space-y-4">
            <Field label="Optional additional context" value={form.context} onChange={(value) => updateField('context', value)} textarea />
            <div className="rounded-2xl border border-line bg-panel-alt p-4 text-sm text-muted">
              Review the campaign brief before generating. The backend will create a strategy, content plan, analytics summary, and optimization recommendations.
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={previous}
            disabled={currentStep === 0 || isPending}
            className="rounded-full border border-line bg-panel px-5 py-3 text-sm font-semibold text-text transition disabled:opacity-50"
          >
            Back
          </button>
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={next} disabled={isPending} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:opacity-50">
              Continue
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={isPending} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:opacity-50">
              {isPending ? 'Generating…' : 'Generate Campaign'}
            </button>
          )}
        </div>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      </Card>

      <div className="space-y-4">
        <MetricCard label="Selected channels" value={String(selectedChannels.length)} delta={selectedChannels.join(' · ')} />
        <Card>
          <div className="text-sm font-semibold text-muted">AI marketing workflow</div>
          <div className="mt-4 space-y-3">
            {(workflow.length ? workflow : defaultWorkflowPreview()).map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">{index + 1}</span>
                <span className="text-sm text-text">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  helperText,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  helperText?: string;
}>) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-text">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm text-text outline-none transition focus:border-accent"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm text-text outline-none transition focus:border-accent"
        />
      )}
      {helperText ? <span className="text-xs text-muted">{helperText}</span> : null}
    </label>
  );
}
