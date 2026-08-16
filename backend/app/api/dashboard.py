from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.campaign import Campaign
from app.models.campaign_metric import CampaignMetric
from app.models.recommendation import Recommendation
from app.schemas.dashboard import DashboardSummary
from app.services.analytics_service import MetricRecord, build_channel_performance, calculate_metric_totals
from app.services.campaign_service import list_campaigns

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary, summary="Get dashboard summary")
def read_dashboard_summary(db: Session = Depends(get_db)) -> DashboardSummary:
    campaign_count = db.scalar(select(func.count()).select_from(Campaign).where(Campaign.status == "active")) or 0
    metrics = list(db.scalars(select(CampaignMetric)))
    metric_records = [
        MetricRecord(
            content_item_id=metric.content_item_id,
            channel=metric.channel,
            content_type=metric.channel,
            impressions=metric.impressions,
            reach=metric.reach,
            engagements=metric.engagements,
            clicks=metric.clicks,
            conversions=metric.conversions,
            spend=float(metric.spend),
        )
        for metric in metrics
    ]
    # Use the analytics service to compute all derived metrics correctly
    totals = calculate_metric_totals(metric_records)
    recent_campaigns = list_campaigns(db)[:5]
    recent_recommendations = list(
        db.scalars(
            select(Recommendation).order_by(Recommendation.created_at.desc()).limit(5)
        )
    )
    return DashboardSummary(
        active_campaigns=campaign_count,
        totals=totals,
        channel_performance=build_channel_performance(metric_records),
        recent_campaigns=recent_campaigns,
        recent_recommendations=recent_recommendations,
    )
