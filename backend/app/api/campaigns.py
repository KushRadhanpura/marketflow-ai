from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.campaign import CampaignCreate, CampaignRead, CampaignUpdate
from app.schemas.content import ContentItemRead
from app.schemas.recommendation import RecommendationRead
from app.schemas.strategy import CampaignStrategyRead
from app.schemas.workflow import CampaignGenerationResponse
from app.services.campaign_generation_service import generate_campaign_assets
from app.services.campaign_service import (
    create_campaign,
    get_campaign,
    list_campaigns,
    update_campaign,
)

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("", response_model=list[CampaignRead], summary="List campaigns")
def read_campaigns(db: Session = Depends(get_db)) -> list[CampaignRead]:
    return list_campaigns(db)


@router.post("", response_model=CampaignRead, status_code=status.HTTP_201_CREATED, summary="Create campaign")
def create_campaign_endpoint(payload: CampaignCreate, db: Session = Depends(get_db)) -> CampaignRead:
    try:
        return create_campaign(db, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid campaign data") from exc


@router.get("/{campaign_id}", response_model=CampaignRead, summary="Get campaign")
def read_campaign(campaign_id: int, db: Session = Depends(get_db)) -> CampaignRead:
    campaign = get_campaign(db, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return campaign


@router.patch("/{campaign_id}", response_model=CampaignRead, summary="Update campaign")
def update_campaign_endpoint(campaign_id: int, payload: CampaignUpdate, db: Session = Depends(get_db)) -> CampaignRead:
    campaign = get_campaign(db, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return update_campaign(db, campaign, payload)


@router.get("/{campaign_id}/strategy", response_model=CampaignStrategyRead, summary="Get campaign strategy")
def read_campaign_strategy(campaign_id: int, db: Session = Depends(get_db)) -> CampaignStrategyRead:
    campaign = get_campaign(db, campaign_id)
    if campaign is None or campaign.strategy is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign strategy not found")
    return campaign.strategy


@router.get("/{campaign_id}/content", response_model=list[ContentItemRead], summary="Get campaign content")
def read_campaign_content(campaign_id: int, db: Session = Depends(get_db)) -> list[ContentItemRead]:
    campaign = get_campaign(db, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return campaign.content_items


@router.get("/{campaign_id}/recommendations", response_model=list[RecommendationRead], summary="Get campaign recommendations")
def read_campaign_recommendations(campaign_id: int, db: Session = Depends(get_db)) -> list[RecommendationRead]:
    campaign = get_campaign(db, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return campaign.recommendations


@router.post("/{campaign_id}/generate", response_model=CampaignGenerationResponse, summary="Generate campaign workflow")
def generate_campaign(campaign_id: int, db: Session = Depends(get_db)) -> CampaignGenerationResponse:
    try:
        return generate_campaign_assets(db, campaign_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
