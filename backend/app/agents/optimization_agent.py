from app.agents.state import AnalyticsInsight, BusinessContext, MarketingStrategy, OptimizationRecommendation


def build_optimization_recommendations(
    context: BusinessContext,
    strategy: MarketingStrategy,
    insight: AnalyticsInsight,
) -> list[OptimizationRecommendation]:
    recommendations: list[OptimizationRecommendation] = []

    if insight.best_content_type:
        recommendations.append(
            OptimizationRecommendation(
                category="content",
                title="Increase top-performing content type",
                description=f"Create more {insight.best_content_type.lower()}-style content in the next campaign.",
                reason=f"{insight.best_content_type} is currently the strongest content type in the measured campaign data.",
                priority="high",
            )
        )

    if insight.best_channel:
        recommendations.append(
            OptimizationRecommendation(
                category="channel",
                title="Lean into the strongest channel",
                description=f"Shift more of the next campaign toward {insight.best_channel}.",
                reason=f"{insight.best_channel} shows the best measured response in the current campaign.",
                priority="high",
            )
        )

    if insight.risks:
        recommendations.append(
            OptimizationRecommendation(
                category="testing",
                title="Address the weakest funnel step",
                description="Test a sharper call to action and stronger conversion framing.",
                reason=insight.risks[0],
                priority="medium",
            )
        )

    if not recommendations:
        recommendations.append(
            OptimizationRecommendation(
                category="planning",
                title="Run the first measured campaign",
                description=f"Execute the planned campaign for {context.primary_goal.lower()} and collect performance data.",
                reason="No analytics findings are available yet.",
                priority="medium",
            )
        )

    return recommendations
