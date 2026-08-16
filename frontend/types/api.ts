export type Business = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  target_audience: string;
  created_at: string;
};

export type Campaign = {
  id: number;
  business_id: number;
  name: string;
  objective: string;
  duration: number;
  budget: number;
  status: string;
  created_at: string;
};

export type MetricTotals = {
  impressions: number;
  reach: number;
  engagements: number;
  clicks: number;
  conversions: number;
  spend: number;
  engagement_rate: number;
  ctr: number;
  conversion_rate: number;
  cost_per_conversion: number;
  roi: number;
};

export type ChannelPerformance = {
  channel: string;
  impressions: number;
  reach: number;
  engagements: number;
  clicks: number;
  conversions: number;
  spend: number;
  engagement_rate: number;
  ctr: number;
  conversion_rate: number;
  cost_per_conversion: number;
  roi: number;
};

export type ContentPerformance = {
  content_item_id: number | null;
  label: string;
  impressions: number;
  engagements: number;
  clicks: number;
  conversions: number;
  engagement_rate: number;
  ctr: number;
  conversion_rate: number;
  spend: number;
};

export type CampaignAnalytics = {
  campaign_id: number;
  start_date: string | null;
  end_date: string | null;
  totals: MetricTotals;
  channel_performance: ChannelPerformance[];
  content_performance: ContentPerformance[];
  best_channel: string | null;
  best_content_type: string | null;
};

export type CampaignRecommendation = {
  id: number;
  campaign_id: number;
  category: string;
  title: string;
  description: string;
  reason: string;
  priority: string;
  created_at: string;
};

export type CampaignStrategy = {
  id: number;
  campaign_id: number;
  strategy: string;
  positioning: string;
  content_pillars: string[];
  kpis: string[];
  channel_strategy: string[];
  created_at: string;
};

export type CampaignContentItem = {
  id?: number;
  campaign_id?: number;
  day: number;
  channel: string;
  content_type: string;
  objective: string;
  hook: string;
  caption: string;
  cta: string;
  creative_brief: string;
  status?: string;
};

export type CampaignGenerationResult = {
  campaign_id: number;
  business_context: {
    business_summary: string;
    target_audience: string;
    primary_goal: string;
    constraints: string[];
    success_metrics: string[];
  };
  strategy: {
    strategy: string;
    positioning: string;
    content_pillars: string[];
    kpis: string[];
    channel_strategy: string[];
  };
  campaign_plan: Array<{
    day: number;
    channel: string;
    content_type: string;
    objective: string;
    hook: string;
    caption: string;
    cta: string;
    creative_brief: string;
  }>;
  content_items: Array<{
    day: number;
    channel: string;
    content_type: string;
    objective: string;
    hook: string;
    caption: string;
    cta: string;
    creative_brief: string;
  }>;
  analytics: CampaignAnalytics;
  insights: {
    summary: string;
    best_channel: string | null;
    best_content_type: string | null;
    risks: string[];
    trends: string[];
  };
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    reason: string;
    priority: string;
  }>;
  workflow_steps: string[];
};

export type DashboardSummary = {
  active_campaigns: number;
  totals: MetricTotals;
  channel_performance: ChannelPerformance[];
  recent_recommendations: CampaignRecommendation[];
  recent_campaigns: Campaign[];
};
