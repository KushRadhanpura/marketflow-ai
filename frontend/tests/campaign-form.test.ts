import { describe, expect, it } from 'vitest';

import { buildCampaignName, defaultWorkflowPreview, parseChannels } from '@/lib/campaign-form';


describe('campaign-form helpers', () => {
  it('parses comma-separated channels', () => {
    expect(parseChannels('Instagram, WhatsApp,  Email ')).toEqual(['Instagram', 'WhatsApp', 'Email']);
  });

  it('builds a campaign display name', () => {
    expect(buildCampaignName('Bean & Brew Café', 'Increase weekend orders')).toBe(
      'Bean & Brew Café - Increase weekend orders',
    );
  });

  it('returns the default workflow preview steps', () => {
    expect(defaultWorkflowPreview()).toEqual([
      'Understanding business',
      'Building strategy',
      'Generating content',
      'Preparing analytics',
      'Generating recommendations',
    ]);
  });
});
