from app.database.session import SessionLocal
from app.models.business import Business
from app.models.campaign import Campaign
from app.models.campaign_metric import CampaignMetric
from app.models.content_item import ContentItem
from app.services.analytics_service import MetricRecord, summarize_analytics
from seed_demo import seed_demo_data


def test_seed_demo_populates_demo_business_campaign_and_metrics() -> None:
    seed_demo_data()
    db = SessionLocal()
    try:
        business = db.query(Business).filter(Business.name == "Bean & Brew Café").first()
        assert business is not None
        campaigns = db.query(Campaign).filter(Campaign.business_id == business.id).all()
        assert len(campaigns) >= 2
        metrics = db.query(CampaignMetric).filter(CampaignMetric.campaign_id == campaigns[0].id).all()
        content_items = db.query(ContentItem).filter(ContentItem.campaign_id == campaigns[0].id).all()
        assert len(metrics) >= 7
        assert len(content_items) >= 1
        summary = summarize_analytics(
            campaigns[0].id,
            [
                MetricRecord(
                    content_item_id=metric.content_item_id,
                    channel=metric.channel,
                    content_type=metric.content_item.content_type if metric.content_item else metric.channel,
                    impressions=metric.impressions,
                    reach=metric.reach,
                    engagements=metric.engagements,
                    clicks=metric.clicks,
                    conversions=metric.conversions,
                    spend=float(metric.spend),
                )
                for metric in metrics
            ],
        )
        assert summary.totals.impressions > 0
        assert summary.best_channel is not None
    finally:
        db.close()
