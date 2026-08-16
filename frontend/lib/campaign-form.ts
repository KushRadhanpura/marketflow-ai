export function parseChannels(input: string): string[] {
  return input
    .split(',')
    .map((channel) => channel.trim())
    .filter(Boolean);
}

export function buildCampaignName(businessName: string, goal: string): string {
  return `${businessName} - ${goal}`;
}

export function defaultWorkflowPreview(): string[] {
  return ['Understanding business', 'Building strategy', 'Generating content', 'Preparing analytics', 'Generating recommendations'];
}
