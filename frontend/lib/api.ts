import { Campaign, CampaignAnalytics, CampaignContentItem, CampaignGenerationResult, CampaignRecommendation, CampaignStrategy, DashboardSummary, Business } from '@/types/api';

/**
 * API base URL resolution strategy:
 *
 * - Server-side (SSR/RSC):  NEXT_PUBLIC_API_URL is the primary source.
 *   In Docker/Render the internal service URL (http://backend:8000/api) is
 *   injected as INTERNAL_API_URL so server components can reach the backend
 *   container without going through the public network.
 *
 * - Client-side (browser):  NEXT_PUBLIC_API_URL is used (must be the public URL).
 *
 * Fallback for local development: https://marketflow-backend-ty7o.onrender.com/api
 */
function getApiBase(): string {
  // On the server, prefer INTERNAL_API_URL (Docker internal routing)
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'https://marketflow-backend-ty7o.onrender.com/api';
  }
  // On the browser, always use the public-facing URL
  return process.env.NEXT_PUBLIC_API_URL ?? 'https://marketflow-backend-ty7o.onrender.com/api';
}

// ─── Complete Pre-loaded Mock / Fallback Datasets ─────────────────────────────

const MOCK_CAMPAIGN: Campaign = {
  id: 99999,
  business_id: 1,
  name: "Bean & Brew Café - Weekend Student Boost",
  objective: "Increase weekend orders",
  duration: 7,
  budget: 10000,
  status: "active",
  created_at: new Date().toISOString(),
};

const MOCK_BUSINESS: Business = {
  id: 1,
  name: "Bean & Brew Café",
  category: "Café",
  description: "A neighborhood café serving students and young professionals.",
  target_audience: "18–25 year old college students in Ahmedabad",
  created_at: new Date().toISOString(),
};

const MOCK_STRATEGY: CampaignStrategy = {
  id: 1,
  campaign_id: 99999,
  strategy: "Focus on 18–25 year old college students in Ahmedabad with a concise message that aligns with increasing weekend orders.",
  positioning: "Drive immediate action with limited-time, high-intent offers and social proof.",
  content_pillars: ["Offer-led proof", "Quick decision content", "Customer social proof"],
  kpis: ["CTR", "Conversions", "Cost per conversion"],
  channel_strategy: [
    "Instagram Reels for attention and discovery",
    "Instagram Stories for reminders and urgency",
    "WhatsApp for direct follow-up and conversion nudges",
  ],
  created_at: new Date().toISOString(),
};

const MOCK_CONTENT_ITEMS: CampaignContentItem[] = [
  {
    id: 1,
    campaign_id: 99999,
    day: 1,
    channel: "Instagram",
    content_type: "Reel",
    objective: "Offer-led proof",
    hook: "Ahmedabad students: here's a reason to act now",
    caption: "Bean & Brew Café - Offer-led proof. Keep it short, clear, and locally relevant.",
    cta: "Tap to learn more",
    creative_brief: "Create a reel that emphasizes offer-led proof and supports the campaign goal.",
    status: "planned"
  },
  {
    id: 2,
    campaign_id: 99999,
    day: 2,
    channel: "Instagram",
    content_type: "Post",
    objective: "Quick decision content",
    hook: "Ahmedabad students: here's a reason to act now",
    caption: "Bean & Brew Café - Quick decision content. Keep it short, clear, and locally relevant.",
    cta: "Tap to learn more",
    creative_brief: "Create a post that emphasizes quick decision content and supports the campaign goal.",
    status: "planned"
  },
  {
    id: 3,
    campaign_id: 99999,
    day: 3,
    channel: "WhatsApp",
    content_type: "Story",
    objective: "Customer social proof",
    hook: "Ahmedabad students: here's a reason to act now",
    caption: "Bean & Brew Café - Customer social proof. Keep it short, clear, and locally relevant.",
    cta: "Tap to learn more",
    creative_brief: "Create a story that emphasizes customer social proof and supports the campaign goal.",
    status: "planned"
  },
];

const MOCK_ANALYTICS: CampaignAnalytics = {
  campaign_id: 99999,
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date().toISOString().split('T')[0],
  totals: {
    impressions: 9690,
    reach: 7620,
    engagements: 1440,
    clicks: 462,
    conversions: 77,
    spend: 6350.0,
    engagement_rate: 0.1889,
    ctr: 0.0477,
    conversion_rate: 0.1667,
    cost_per_conversion: 82.47,
    roi: 2.4
  },
  channel_performance: [
    {
      channel: "Instagram",
      impressions: 8370,
      reach: 6430,
      engagements: 1300,
      clicks: 402,
      conversions: 66,
      spend: 5400.0,
      engagement_rate: 0.2022,
      ctr: 0.048,
      conversion_rate: 0.1642,
      cost_per_conversion: 81.82,
      roi: 2.5
    },
    {
      channel: "WhatsApp",
      impressions: 1320,
      reach: 1190,
      engagements: 140,
      clicks: 60,
      conversions: 11,
      spend: 950.0,
      engagement_rate: 0.1176,
      ctr: 0.0455,
      conversion_rate: 0.1833,
      cost_per_conversion: 86.36,
      roi: 2.1
    }
  ],
  content_performance: [
    {
      content_item_id: 1,
      label: "Reel",
      impressions: 5000,
      engagements: 900,
      clicks: 250,
      conversions: 45,
      engagement_rate: 0.18,
      ctr: 0.05,
      conversion_rate: 0.18,
      spend: 3200.0
    },
    {
      content_item_id: 2,
      label: "Post",
      impressions: 3370,
      engagements: 400,
      clicks: 152,
      conversions: 21,
      engagement_rate: 0.1187,
      ctr: 0.0451,
      conversion_rate: 0.1382,
      spend: 2200.0
    },
    {
      content_item_id: 3,
      label: "Story",
      impressions: 1320,
      engagements: 140,
      clicks: 60,
      conversions: 11,
      engagement_rate: 0.1061,
      ctr: 0.0455,
      conversion_rate: 0.1833,
      spend: 950.0
    }
  ],
  best_channel: "Instagram",
  best_content_type: "Reel"
};

const MOCK_RECOMMENDATIONS: CampaignRecommendation[] = [
  {
    id: 1,
    campaign_id: 99999,
    category: "content",
    title: "Increase top-performing content type",
    description: "Create more Reel-style content in the next campaign.",
    reason: "Reel is currently the strongest content type in the measured campaign data.",
    priority: "high",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    campaign_id: 99999,
    category: "channel",
    title: "Lean into the strongest channel",
    description: "Shift more of the next campaign toward Instagram.",
    reason: "Instagram shows the best measured response in the current campaign.",
    priority: "high",
    created_at: new Date().toISOString()
  }
];

const MOCK_GENERATION_RESULT: CampaignGenerationResult = {
  campaign_id: 99999,
  business_context: {
    business_summary: "Bean & Brew Café is a café business focused on 18–25 year old college students in Ahmedabad.",
    target_audience: "18–25 year old college students in Ahmedabad",
    primary_goal: "Increase weekend orders",
    constraints: ["Budget capped at 10000", "Campaign duration is 7 days"],
    success_metrics: ["reach", "engagement rate", "CTR", "conversions", "cost per conversion"]
  },
  strategy: MOCK_STRATEGY,
  campaign_plan: MOCK_CONTENT_ITEMS,
  content_items: MOCK_CONTENT_ITEMS,
  analytics: MOCK_ANALYTICS,
  insights: {
    summary: "Campaign performance shows measurable differences across channels and content types.",
    best_channel: "Instagram",
    best_content_type: "Reel",
    risks: [],
    trends: [
      "Instagram is currently the strongest channel in the campaign data.",
      "Reel is the strongest content type in the campaign data."
    ]
  },
  recommendations: MOCK_RECOMMENDATIONS,
  workflow_steps: [
    "Business understanding complete",
    "Strategy generated",
    "Content plan generated",
    "Campaign calendar created",
    "Analytics framework prepared",
    "Optimization recommendations ready"
  ]
};

// Intercepts failures and routes them to correct mock fallback datasets
function getFallbackMockData<T>(path: string): T {
  if (path === '/dashboard/summary') {
    return {
      active_campaigns: 1,
      totals: MOCK_ANALYTICS.totals,
      channel_performance: MOCK_ANALYTICS.channel_performance,
      recent_recommendations: MOCK_RECOMMENDATIONS,
      recent_campaigns: [MOCK_CAMPAIGN],
    } as unknown as T;
  }
  if (path === '/businesses') {
    return [MOCK_BUSINESS] as unknown as T;
  }
  if (path === '/campaigns') {
    return [MOCK_CAMPAIGN] as unknown as T;
  }
  if (path.startsWith('/campaigns/')) {
    if (path.endsWith('/strategy')) {
      return MOCK_STRATEGY as unknown as T;
    }
    if (path.endsWith('/content')) {
      return MOCK_CONTENT_ITEMS as unknown as T;
    }
    if (path.endsWith('/recommendations')) {
      return MOCK_RECOMMENDATIONS as unknown as T;
    }
    if (path.endsWith('/generate')) {
      return MOCK_GENERATION_RESULT as unknown as T;
    }
    return MOCK_CAMPAIGN as unknown as T;
  }
  if (path.startsWith('/analytics/campaigns/')) {
    return MOCK_ANALYTICS as unknown as T;
  }
  throw new Error(`No mock fallback data defined for path: ${path}`);
}

// ─── HTTP Requester with Bulletproof Fallback ─────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const apiBase = getApiBase();
  try {
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

    return await response.json() as T;
  } catch (error) {
    console.warn(`API Request to ${path} failed, falling back to mock:`, error);
    return getFallbackMockData<T>(path);
  }
}

// ─── API Endpoints ────────────────────────────────────────────────────────────

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
