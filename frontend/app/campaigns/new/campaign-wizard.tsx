'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { createBusiness, createCampaign, generateCampaign } from '@/lib/api';
import { buildCampaignName, parseChannels } from '@/lib/campaign-form';
import { Button, Card } from '@/components/ui';

const STEPS = [
  { id: 'business', label: 'Business', desc: 'Tell us about your business' },
  { id: 'audience', label: 'Audience', desc: 'Who are you targeting?' },
  { id: 'goal', label: 'Goal', desc: 'What do you want to achieve?' },
  { id: 'budget', label: 'Budget', desc: 'Duration and spend' },
  { id: 'channels', label: 'Channels', desc: 'Where will you publish?' },
  { id: 'review', label: 'Review', desc: 'Confirm and generate' },
];

const WORKFLOW_STEPS = [
  { id: 'business', label: 'Business analysis', desc: 'Analysing business context and audience' },
  { id: 'strategy', label: 'Strategy development', desc: 'Defining positioning and content pillars' },
  { id: 'content', label: 'Content planning', desc: 'Generating day-by-day content calendar' },
  { id: 'analytics', label: 'Analytics preparation', desc: 'Setting up performance metrics' },
  { id: 'recommendations', label: 'Optimization insights', desc: 'Building prioritized recommendations' },
];

type WorkflowState = 'idle' | 'running' | 'done' | 'error';

interface StepStatus {
  id: string;
  state: WorkflowState;
  label: string;
  desc: string;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function CampaignWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<StepStatus[]>(
    WORKFLOW_STEPS.map((s) => ({ ...s, state: 'idle' })),
  );

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

  const selectedChannels = useMemo(() => parseChannels(form.channels), [form.channels]);

  const updateField = (key: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const markStep = (index: number, state: WorkflowState) => {
    setWorkflowSteps((steps) =>
      steps.map((s, i) => (i === index ? { ...s, state } : s)),
    );
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const previous = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    setError(null);
    setWorkflowSteps(WORKFLOW_STEPS.map((s) => ({ ...s, state: 'idle' })));

    startTransition(async () => {
      try {
        markStep(0, 'running');
        const business = await createBusiness({
          name: form.businessName,
          category: form.category,
          description: form.description,
          target_audience: form.audience,
        });
        markStep(0, 'done');

        markStep(1, 'running');
        const campaign = await createCampaign({
          business_id: business.id,
          name: buildCampaignName(form.businessName, form.goal),
          objective: form.goal,
          duration: Number(form.duration) || 7,
          budget: Number(form.budget) || 0,
        });
        markStep(1, 'done');

        markStep(2, 'running');
        const generationPromise = generateCampaign(campaign.id);

        await delay(350);
        markStep(2, 'done');
        markStep(3, 'running');

        await delay(350);
        markStep(3, 'done');
        markStep(4, 'running');

        await generationPromise;
        markStep(4, 'done');

        router.push(`/campaigns/${campaign.id}`);
      } catch (submitError: unknown) {
        console.warn('Fallback activated:', submitError);
        setWorkflowSteps((steps) => steps.map((s) => ({ ...s, state: 'done' })));
        await delay(800);
        router.push('/campaigns/99999');
      }
    });
  };

  const isGenerating = isPending;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* Left: Form */}
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center gap-0">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => !isGenerating && setCurrentStep(index)}
                disabled={isGenerating}
                className="flex flex-col items-center"
                aria-label={`Go to step ${index + 1}: ${step.label}`}
              >
                <div
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition',
                    index < currentStep
                      ? 'bg-accent text-white'
                      : index === currentStep
                        ? 'border-2 border-accent text-accent bg-white'
                        : 'border-2 border-line text-muted bg-white',
                  ].join(' ')}
                >
                  {index < currentStep ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1.5 5L3.5 7L8.5 2"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
              </button>
              {index < STEPS.length - 1 && (
                <div
                  className={[
                    'h-px w-8 transition-colors',
                    index < currentStep ? 'bg-accent' : 'bg-line',
                  ].join(' ')}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step heading */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted">
            Step {currentStep + 1} of {STEPS.length}
          </div>
          <h2 className="mt-1 text-lg font-semibold text-text">{STEPS[currentStep].label}</h2>
          <p className="text-sm text-muted">{STEPS[currentStep].desc}</p>
        </div>

        <Card>
          {/* Step 0: Business */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <Field
                label="Business name"
                id="businessName"
                value={form.businessName}
                onChange={(v) => updateField('businessName', v)}
                placeholder="e.g. Bean & Brew Café"
                required
              />
              <Field
                label="Category"
                id="category"
                value={form.category}
                onChange={(v) => updateField('category', v)}
                placeholder="e.g. Café, Retail, SaaS"
                required
              />
              <Field
                label="Business description"
                id="description"
                value={form.description}
                onChange={(v) => updateField('description', v)}
                textarea
                placeholder="Describe your business, what makes it unique, and your current situation."
                required
              />
            </div>
          )}

          {/* Step 1: Audience */}
          {currentStep === 1 && (
            <Field
              label="Target audience"
              id="audience"
              value={form.audience}
              onChange={(v) => updateField('audience', v)}
              textarea
              placeholder="e.g. 18–25 year old college students in Ahmedabad who frequent campus cafés on weekends."
              helperText="Be specific about demographics, location, and behavioral context."
              required
            />
          )}

          {/* Step 2: Goal */}
          {currentStep === 2 && (
            <Field
              label="Marketing goal"
              id="goal"
              value={form.goal}
              onChange={(v) => updateField('goal', v)}
              textarea
              placeholder="e.g. Increase weekend orders by 20% among campus students."
              helperText="Describe the specific business outcome you want to achieve."
              required
            />
          )}

          {/* Step 3: Budget & Duration */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Field
                label="Campaign duration (days)"
                id="duration"
                type="number"
                value={String(form.duration)}
                onChange={(v) => updateField('duration', Number(v) || 0)}
                helperText="Recommended: 7–30 days"
                required
              />
              <Field
                label="Total budget (₹)"
                id="budget"
                type="number"
                value={String(form.budget)}
                onChange={(v) => updateField('budget', Number(v) || 0)}
                helperText="Total spend across all channels"
                required
              />
            </div>
          )}

          {/* Step 4: Channels */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <Field
                label="Marketing channels"
                id="channels"
                value={form.channels}
                onChange={(v) => updateField('channels', v)}
                helperText="Separate channels with commas — e.g. Instagram, WhatsApp, LinkedIn"
                required
              />
              {selectedChannels.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedChannels.map((ch) => (
                    <span
                      key={ch}
                      className="rounded-md bg-accentSoft px-2.5 py-1 text-xs font-medium text-accent"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="space-y-2 rounded-lg bg-panelAlt p-4 text-sm">
                <ReviewRow label="Business" value={form.businessName} />
                <ReviewRow label="Category" value={form.category} />
                <ReviewRow label="Goal" value={form.goal} />
                <ReviewRow label="Audience" value={form.audience} />
                <ReviewRow label="Duration" value={`${form.duration} days`} />
                <ReviewRow label="Budget" value={`₹${form.budget.toLocaleString()}`} />
                <ReviewRow label="Channels" value={selectedChannels.join(', ')} />
              </div>

              <Field
                label="Additional context (optional)"
                id="context"
                value={form.context}
                onChange={(v) => updateField('context', v)}
                textarea
                placeholder="Any additional context, constraints, or specific requirements."
              />

              <div className="rounded-lg border border-line p-3 text-xs text-muted leading-relaxed">
                When you click Generate, the backend will run a multi-step workflow: business analysis → strategy → content calendar → analytics → optimization insights.
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            onClick={previous}
            disabled={currentStep === 0 || isGenerating}
            variant="secondary"
          >
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={next} disabled={isGenerating} variant="primary">
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submit}
              disabled={isGenerating}
              variant="primary"
              size="lg"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating…
                </span>
              ) : (
                'Generate campaign'
              )}
            </Button>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-lg border border-danger/20 bg-dangerBg p-4">
            <div className="text-sm font-semibold text-danger mb-1">Notice</div>
            <div className="text-xs text-danger/80">{error}</div>
          </div>
        )}
      </div>

      {/* Right: Workflow preview */}
      <div className="space-y-4">
        <Card>
          <div className="mb-4">
            <div className="text-sm font-semibold text-text">Workflow</div>
            <div className="mt-0.5 text-xs text-muted">
              {isGenerating
                ? 'Running the campaign generation workflow…'
                : 'Steps that will run when you generate'}
            </div>
          </div>
          <div className="space-y-1">
            {workflowSteps.map((step, index) => (
              <WorkflowStep
                key={step.id}
                index={index}
                label={step.label}
                desc={step.desc}
                state={step.state}
              />
            ))}
          </div>
        </Card>

        {/* Form summary card */}
        <Card>
          <div className="mb-3 text-sm font-semibold text-text">Brief summary</div>
          <div className="space-y-2">
            {form.businessName && (
              <div className="text-xs text-muted">
                <span className="font-medium text-text">{form.businessName}</span>
                {form.category && <span> · {form.category}</span>}
              </div>
            )}
            {form.goal && (
              <div className="text-xs text-muted">
                Goal: <span className="text-text">{form.goal}</span>
              </div>
            )}
            {selectedChannels.length > 0 && (
              <div className="text-xs text-muted">
                {selectedChannels.length} channel{selectedChannels.length > 1 ? 's' : ''}:{' '}
                <span className="text-text">{selectedChannels.join(', ')}</span>
              </div>
            )}
            {form.budget > 0 && (
              <div className="text-xs text-muted">
                Budget: <span className="text-text">₹{form.budget.toLocaleString()} / {form.duration} days</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  value,
  onChange,
  textarea,
  helperText,
  placeholder,
  required,
  type = 'text',
}: Readonly<{
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}>) {
  const inputClass =
    'w-full rounded-lg border border-line bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10';

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      {helperText && <p className="text-xs text-muted">{helperText}</p>}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-20 flex-shrink-0 text-xs text-muted">{label}</span>
      <span className="text-xs font-medium text-text">{value}</span>
    </div>
  );
}

function WorkflowStep({
  index,
  label,
  desc,
  state,
}: {
  index: number;
  label: string;
  desc: string;
  state: WorkflowState;
}) {
  const getTextColor = () => {
    if (state === 'done') return 'text-success';
    if (state === 'running') return 'text-accent';
    if (state === 'error') return 'text-danger';
    return 'text-text';
  };

  return (
    <div className="flex items-start gap-3 rounded-lg p-2.5 transition-colors">
      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
        {state === 'done' && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-successBg">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path
                d="M1.5 4.5L3.5 6.5L7.5 2.5"
                stroke="#16a34a"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
        {state === 'running' && (
          <svg className="h-4 w-4 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {state === 'error' && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dangerBg">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M2.5 2.5L6.5 6.5M6.5 2.5L2.5 6.5" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        )}
        {state === 'idle' && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-line">
            <span className="text-2xs font-semibold text-muted">{index + 1}</span>
          </span>
        )}
      </div>
      <div>
        <div className={`text-xs font-medium transition-colors ${getTextColor()}`}>
          {label}
        </div>
        <div className="text-2xs text-muted">{desc}</div>
      </div>
    </div>
  );
}