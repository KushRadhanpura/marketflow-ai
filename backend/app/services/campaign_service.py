from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.business import Business
from app.models.campaign import Campaign
from app.models.campaign_metric import CampaignMetric
from app.models.campaign_strategy import CampaignStrategy
from app.models.content_item import ContentItem
from app.models.recommendation import Recommendation
from app.schemas.campaign import CampaignCreate, CampaignUpdate
from app.schemas.content import ContentItemCreate
from app.schemas.recommendation import RecommendationCreate
from app.schemas.strategy import CampaignStrategyCreate


def create_business(db: Session, name: str, category: str, description: str | None, target_audience: str) -> Business:
    business = Business(
        name=name,
        category=category,
        description=description,
        target_audience=target_audience,
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    return business


def list_businesses(db: Session) -> list[Business]:
    statement = select(Business).order_by(Business.created_at.desc())
    return list(db.scalars(statement))


def get_business(db: Session, business_id: int) -> Business | None:
    statement = select(Business).where(Business.id == business_id)
    return db.scalar(statement)


def create_campaign(db: Session, payload: CampaignCreate) -> Campaign:
    campaign = Campaign(**payload.model_dump())
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


def update_campaign(db: Session, campaign: Campaign, payload: CampaignUpdate) -> Campaign:
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(campaign, key, value)
    db.commit()
    db.refresh(campaign)
    return campaign


def list_campaigns(db: Session) -> list[Campaign]:
    statement = select(Campaign).options(selectinload(Campaign.business)).order_by(Campaign.created_at.desc())
    return list(db.scalars(statement))


def get_campaign(db: Session, campaign_id: int) -> Campaign | None:
    statement = (
        select(Campaign)
        .where(Campaign.id == campaign_id)
        .options(
            selectinload(Campaign.business),
            selectinload(Campaign.strategy),
            selectinload(Campaign.content_items),
            selectinload(Campaign.metrics),
            selectinload(Campaign.recommendations),
        )
    )
    return db.scalar(statement)


def create_strategy(db: Session, payload: CampaignStrategyCreate) -> CampaignStrategy:
    strategy = CampaignStrategy(**payload.model_dump())
    db.add(strategy)
    db.commit()
    db.refresh(strategy)
    return strategy


def create_content_item(db: Session, payload: ContentItemCreate) -> ContentItem:
    content_item = ContentItem(**payload.model_dump())
    db.add(content_item)
    db.commit()
    db.refresh(content_item)
    return content_item


def create_recommendation(db: Session, payload: RecommendationCreate) -> Recommendation:
    recommendation = Recommendation(**payload.model_dump())
    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)
    return recommendation


def list_campaign_metrics(db: Session, campaign_id: int) -> list[CampaignMetric]:
    statement = select(CampaignMetric).where(CampaignMetric.campaign_id == campaign_id).order_by(CampaignMetric.date.asc())
    return list(db.scalars(statement))
