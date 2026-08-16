import { Campaign, CampaignAnalytics, CampaignContentItem, CampaignGenerationResult, CampaignRecommendation, CampaignStrategy, DashboardSummary, Business } from '@/types/api';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>('/dashboard/summary');
}

export function listBusinesses(): Promise<Business[]> {
  return request<Business[]>('/businesses');
}

export function createBusiness(payload: Omit<Business, 'id' | 'created_at'>): Promise<Business> {
  return request<Business>('/businesses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function listCampaigns(): Promise<Campaign[]> {
  return request<Campaign[]>('/campaigns');
}

export function createCampaign(payload: Omit<Campaign, 'id' | 'created_at' | 'status'> & { business_id: number }): Promise<Campaign> {
  return request<Campaign>('/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function generateCampaign(campaignId: number): Promise<CampaignGenerationResult> {
  return request<CampaignGenerationResult>(`/campaigns/${campaignId}/generate`, { method: 'POST' });
}

export function getCampaign(campaignId: number): Promise<Campaign> {
  return request<Campaign>(`/campaigns/${campaignId}`);
}

export function getCampaignStrategy(campaignId: number): Promise<CampaignStrategy> {
  return request<CampaignStrategy>(`/campaigns/${campaignId}/strategy`);
}

export function getCampaignContent(campaignId: number): Promise<CampaignContentItem[]> {
  return request<CampaignContentItem[]>(`/campaigns/${campaignId}/content`);
}

export function getCampaignAnalytics(campaignId: number): Promise<CampaignAnalytics> {
  return request<CampaignAnalytics>(`/analytics/campaigns/${campaignId}`);
}

export function getCampaignRecommendations(campaignId: number): Promise<CampaignRecommendation[]> {
  return request<CampaignRecommendation[]>(`/campaigns/${campaignId}/recommendations`);
}
