from app.agents.state import CampaignDayPlan, ContentCreative, MarketingStrategy
from app.schemas.campaign import CampaignRead


def build_campaign_plan(campaign: CampaignRead, strategy: MarketingStrategy, creatives: list[ContentCreative]) -> list[CampaignDayPlan]:
    channel_cycle = ["Instagram", "Instagram", "WhatsApp", "Instagram", "WhatsApp", "Instagram", "Instagram"]
    objective_cycle = ["Awareness", "Value", "Engagement", "Social proof", "Offer", "Reminder", "Final CTA"]
    content_cycle = ["Reel", "Post", "Story", "Carousel", "Story", "Reel", "Story"]
    plan: list[CampaignDayPlan] = []
    for day in range(1, min(campaign.duration, 7) + 1):
        creative = creatives[(day - 1) % len(creatives)]
        plan.append(
            CampaignDayPlan(
                day=day,
                channel=channel_cycle[day - 1],
                content_type=content_cycle[day - 1],
                objective=objective_cycle[day - 1],
                hook=creative.hook,
                caption=creative.caption,
                cta=creative.cta if day < 7 else "Book now or reply to this message",
                creative_brief=creative.creative_brief,
            )
        )
    return plan
