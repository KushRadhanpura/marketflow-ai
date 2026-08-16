from app.agents.state import BusinessContext
from app.schemas.business import BusinessRead
from app.schemas.campaign import CampaignRead


def build_business_context(campaign: CampaignRead, business: BusinessRead) -> BusinessContext:
    audience = business.target_audience or "the target audience"
    objective = campaign.objective.lower()
    constraints = [
        f"Budget capped at {campaign.budget}",
        f"Campaign duration is {campaign.duration} days",
    ]
    if campaign.budget <= 0:
        constraints.append("No paid spend available")
    success_metrics = ["reach", "engagement rate", "CTR", "conversions"]
    if "order" in objective or "sales" in objective:
        success_metrics.append("cost per conversion")
    return BusinessContext(
        business_summary=f"{business.name} is a {business.category.lower()} business focused on {audience}.",
        target_audience=audience,
        primary_goal=campaign.objective,
        constraints=constraints,
        success_metrics=success_metrics,
    )
