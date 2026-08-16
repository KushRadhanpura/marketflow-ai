from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.analytics import AnalyticsSummary
from app.services.analytics_service import MetricRecord, summarize_analytics
from app.services.campaign_service import get_campaign, list_campaign_metrics

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/campaigns/{campaign_id}", response_model=AnalyticsSummary, summary="Get campaign analytics")
def read_campaign_analytics(campaign_id: int, db: Session = Depends(get_db)) -> AnalyticsSummary:
    campaign = get_campaign(db, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    content_lookup = {content_item.id: content_item.content_type for content_item in campaign.content_items}
    metrics = [
        MetricRecord(
            content_item_id=metric.content_item_id,
            channel=metric.channel,
            content_type=content_lookup.get(metric.content_item_id, metric.channel),
            impressions=metric.impressions,
            reach=metric.reach,
            engagements=metric.engagements,
            clicks=metric.clicks,
            conversions=metric.conversions,
            spend=float(metric.spend),
        )
        for metric in list_campaign_metrics(db, campaign_id)
    ]
    return summarize_analytics(campaign_id=campaign_id, records=metrics)
