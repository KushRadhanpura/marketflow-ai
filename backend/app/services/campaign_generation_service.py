from __future__ import annotations

import json

from sqlalchemy.orm import Session

from app.agents.graph import marketing_graph
from app.agents.state import MarketingStrategy, OptimizationRecommendation
from app.models.campaign import Campaign
from app.schemas.business import BusinessRead
from app.schemas.campaign import CampaignRead
from app.schemas.content import ContentItemCreate
from app.schemas.recommendation import RecommendationCreate
from app.schemas.strategy import CampaignStrategyCreate
from app.schemas.workflow import CampaignGenerationResponse
from app.services.campaign_service import create_content_item, create_recommendation, create_strategy, get_campaign
from app.services.llm_provider import OpenAICompatibleLLMProvider, get_llm_provider


def _maybe_parse_json(raw_text: str) -> object | None:
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        return None


def _refine_strategy_with_llm(strategy: MarketingStrategy, business_summary: str, campaign_objective: str) -> MarketingStrategy:
    provider = get_llm_provider()
    if not isinstance(provider, OpenAICompatibleLLMProvider):
        return strategy

    prompt = (
        'Return JSON only that matches this schema: '
        '{"strategy":"...","positioning":"...","content_pillars":["..."],"kpis":["..."],"channel_strategy":["..."]}. '
        f"Business summary: {business_summary}. Campaign objective: {campaign_objective}. "
        f"Current strategy: {strategy.model_dump_json()}."
    )
    parsed = _maybe_parse_json(provider.generate_text(prompt))
    if not isinstance(parsed, dict):
        return strategy

    try:
        return MarketingStrategy.model_validate(parsed)
    except Exception:
        return strategy


def _refine_recommendations_with_llm(
    recommendations: list[OptimizationRecommendation],
    campaign_objective: str,
    strategy: MarketingStrategy,
) -> list[OptimizationRecommendation]:
    provider = get_llm_provider()
    if not isinstance(provider, OpenAICompatibleLLMProvider):
        return recommendations

    prompt = (
        'Return JSON only as an array of recommendation objects with keys '
        '["category","title","description","reason","priority"]. '
        f"Campaign objective: {campaign_objective}. Strategy: {strategy.model_dump_json()}. "
        f"Current recommendations: {[item.model_dump() for item in recommendations]}."
    )
    parsed = _maybe_parse_json(provider.generate_text(prompt))
    if not isinstance(parsed, list):
        return recommendations

    refined: list[OptimizationRecommendation] = []
    for item in parsed:
        if not isinstance(item, dict):
            continue
        try:
            refined.append(OptimizationRecommendation.model_validate(item))
        except Exception:
            continue
    return refined or recommendations


def generate_campaign_assets(db: Session, campaign_id: int) -> CampaignGenerationResponse:
    campaign = get_campaign(db, campaign_id)
    if campaign is None or campaign.business is None:
        raise ValueError("Campaign not found")

    state = marketing_graph.invoke(
        {
            "campaign_record": campaign,
            "campaign": CampaignRead.model_validate(campaign),
            "business": BusinessRead.model_validate(campaign.business),
        }
    )

    refined_strategy = _refine_strategy_with_llm(
        state["strategy"],
        state["business_context"].business_summary,
        state["campaign"].objective,
    )
    refined_recommendations = _refine_recommendations_with_llm(
        state["recommendations"],
        state["campaign"].objective,
        refined_strategy,
    )

    if campaign.strategy is not None:
        db.delete(campaign.strategy)
    for content_item in list(campaign.content_items):
        db.delete(content_item)
    for recommendation in list(campaign.recommendations):
        db.delete(recommendation)

    db.flush()

    create_strategy(
        db,
        CampaignStrategyCreate(
            campaign_id=campaign.id,
            strategy=refined_strategy.strategy,
            positioning=refined_strategy.positioning,
            content_pillars=refined_strategy.content_pillars,
            kpis=refined_strategy.kpis,
            channel_strategy=refined_strategy.channel_strategy,
        ),
    )

    for item in state["content_items"]:
        create_content_item(
            db,
            ContentItemCreate(
                campaign_id=campaign.id,
                day=item.day,
                channel=item.channel,
                content_type=item.content_type,
                objective=item.objective,
                hook=item.hook,
                caption=item.caption,
                cta=item.cta,
                creative_brief=item.creative_brief,
            ),
        )

    for item in refined_recommendations:
        create_recommendation(
            db,
            RecommendationCreate(
                campaign_id=campaign.id,
                category=item.category,
                title=item.title,
                description=item.description,
                reason=item.reason,
                priority=item.priority,
            ),
        )

    campaign.status = "active"
    db.add(campaign)
    db.commit()

    persisted_campaign = get_campaign(db, campaign.id)
    if persisted_campaign is None or persisted_campaign.business is None or persisted_campaign.strategy is None:
        raise ValueError("Failed to persist generated campaign assets")

    return CampaignGenerationResponse(
        campaign_id=campaign.id,
        business_context=state["business_context"],
        strategy=refined_strategy,
        campaign_plan=state["campaign_plan"],
        content_items=state["content_items"],
        analytics=state["analytics"],
        insights=state["insights"],
        recommendations=refined_recommendations,
        workflow_steps=[
            "Business understanding complete",
            "Strategy generated",
            "Content plan generated",
            "Campaign calendar created",
            "Analytics framework prepared",
            "Optimization recommendations ready",
        ],
    )
