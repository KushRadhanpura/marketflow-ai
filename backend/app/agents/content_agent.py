from app.agents.state import BusinessContext, ContentCreative, MarketingStrategy


def build_content_creatives(context: BusinessContext, strategy: MarketingStrategy) -> list[ContentCreative]:
    pillar_pairs = list(zip(strategy.content_pillars, ["Reel", "Story", "Post"], strict=False))
    creatives: list[ContentCreative] = []
    for index, (pillar, content_type) in enumerate(pillar_pairs, start=1):
        creatives.append(
            ContentCreative(
                day=index,
                channel="Instagram",
                content_type=content_type,
                objective=pillar,
                hook=f"{context.target_audience}: here's a reason to act now",
                caption=f"{context.business_summary} - {pillar}. Keep it short, clear, and locally relevant.",
                cta="Tap to learn more",
                creative_brief=f"Create a {content_type.lower()} that emphasizes {pillar.lower()} and supports the campaign goal.",
            )
        )
    if not creatives:
        creatives.append(
            ContentCreative(
                day=1,
                channel="Instagram",
                content_type="Reel",
                objective="Awareness",
                hook=f"A quick reason for {context.target_audience} to pay attention",
                caption=f"{context.business_summary} - simple awareness message aligned to {context.primary_goal}.",
                cta="Learn more",
                creative_brief="Create a clear awareness creative with a strong opening hook.",
            )
        )
    return creatives
