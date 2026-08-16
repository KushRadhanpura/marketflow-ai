from app.agents.state import BusinessContext, MarketingStrategy


def build_strategy(context: BusinessContext) -> MarketingStrategy:
    goal = context.primary_goal.lower()
    if "order" in goal or "sales" in goal:
        positioning = "Drive immediate action with limited-time, high-intent offers and social proof."
        content_pillars = ["Offer-led proof", "Quick decision content", "Customer social proof"]
        kpis = ["CTR", "Conversions", "Cost per conversion"]
    else:
        positioning = "Build awareness and engagement with value-first, audience-relevant content."
        content_pillars = ["Brand story", "Value content", "Community engagement"]
        kpis = ["Reach", "Engagement rate", "CTR"]

    channel_strategy = [
        "Instagram Reels for attention and discovery",
        "Instagram Stories for reminders and urgency",
        "WhatsApp for direct follow-up and conversion nudges",
    ]
    return MarketingStrategy(
        strategy=f"Focus on {context.target_audience.lower()} with a concise message that aligns with {context.primary_goal.lower()}.",
        positioning=positioning,
        content_pillars=content_pillars,
        kpis=kpis,
        channel_strategy=channel_strategy,
    )
