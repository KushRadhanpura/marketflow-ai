from __future__ import annotations

from collections.abc import Iterable
from datetime import date, timedelta

from sqlalchemy import select

from app.agents.state import ContentCreative
from app.database.base import Base
from app.database.session import SessionLocal, engine, ensure_sqlite_campaign_metric_columns
from app.models.business import Business
from app.models.campaign import Campaign
from app.models.campaign_metric import CampaignMetric
from app.services.campaign_generation_service import generate_campaign_assets
from app.services.campaign_service import create_campaign, create_business, get_campaign
from app.schemas.campaign import CampaignCreate


def _ensure_business(db) -> Business:
    existing = db.scalar(select(Business).where(Business.name == "Bean & Brew Café"))
    if existing is not None:
        return existing
    return create_business(
        db,
        name="Bean & Brew Café",
        category="Café",
        description="A neighborhood café serving students and young professionals.",
        target_audience="18-25 year old college students in Ahmedabad",
    )


def _ensure_campaign(db, business_id: int, name: str, objective: str, duration: int, budget: float) -> Campaign:
    existing = db.scalar(select(Campaign).where(Campaign.name == name))
    if existing is not None:
        return existing
    return create_campaign(
        db,
        CampaignCreate(
            business_id=business_id,
            name=name,
            objective=objective,
            duration=duration,
            budget=budget,
        ),
    )


def _seed_metrics(db, campaign: Campaign, creatives: list[ContentCreative], profile: str) -> None:
    existing_metrics = list(campaign.metrics)
    for metric in existing_metrics:
        db.delete(metric)
    db.flush()

    start_date = date.today() - timedelta(days=6)
    patterns = [
        ("Instagram", 1200, 920, 96, 28, 20, 190, 64, 7, 900.0),
        ("Instagram", 1350, 1010, 112, 30, 23, 220, 78, 9, 1000.0),
        ("WhatsApp", 620, 560, 48, 16, 11, 80, 28, 8, 450.0),
        ("Instagram", 1500, 1120, 126, 35, 28, 240, 82, 11, 1100.0),
        ("WhatsApp", 700, 630, 54, 18, 12, 90, 32, 10, 500.0),
        ("Instagram", 1800, 1320, 164, 44, 36, 320, 120, 18, 1350.0),
        ("Instagram", 2100, 1580, 198, 52, 40, 390, 140, 22, 1550.0),
    ]
    if profile == "low_ctr":
        patterns = [
            ("Instagram", 1100, 780, 70, 20, 15, 90, 26, 2, 850.0),
            ("Instagram", 1250, 860, 78, 22, 17, 100, 28, 2, 900.0),
            ("WhatsApp", 500, 430, 24, 8, 5, 30, 8, 1, 300.0),
            ("Instagram", 1300, 900, 82, 24, 18, 110, 30, 2, 950.0),
            ("WhatsApp", 540, 460, 26, 9, 6, 34, 10, 1, 320.0),
            ("Instagram", 1450, 980, 94, 26, 20, 120, 34, 3, 1000.0),
            ("Instagram", 1600, 1100, 108, 28, 23, 140, 38, 4, 1150.0),
        ]

    for index, (channel, impressions, reach, likes, comments, shares, engagements, clicks, conversions, spend) in enumerate(patterns):
        creative = creatives[index % len(creatives)]
        db.add(
            CampaignMetric(
                campaign_id=campaign.id,
                content_item_id=creative.id,
                date=start_date + timedelta(days=index),
                channel=channel,
                impressions=impressions,
                reach=reach,
                likes=likes,
                comments=comments,
                shares=shares,
                engagements=engagements,
                clicks=clicks,
                conversions=conversions,
                spend=spend,
            )
        )


def seed_demo_data() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_sqlite_campaign_metric_columns()
    db = SessionLocal()
    try:
        business = _ensure_business(db)
        campaigns = [
            ("Weekend Student Boost", "Increase weekend orders", 7, 10000.0, "high_ctr"),
            ("Midweek Coffee Club", "Drive midweek footfall", 7, 8000.0, "low_ctr"),
        ]
        for name, objective, duration, budget, profile in campaigns:
            campaign = _ensure_campaign(db, business.id, name, objective, duration, budget)
            for metric in list(campaign.metrics):
                db.delete(metric)
            db.commit()
            generated = generate_campaign_assets(db, campaign.id)
            refreshed_campaign = get_campaign(db, campaign.id)
            if refreshed_campaign is None:
                raise RuntimeError(f"Failed to load campaign {campaign.id}")
            _seed_metrics(db, refreshed_campaign, refreshed_campaign.content_items, profile)
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
    print("Seeded demo data for MarketFlow AI.")
