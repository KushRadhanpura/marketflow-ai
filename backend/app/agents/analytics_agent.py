from app.agents.state import AnalyticsInsight
from app.schemas.analytics import AnalyticsSummary


def interpret_analytics(summary: AnalyticsSummary) -> AnalyticsInsight:
    if not summary.channel_performance:
        return AnalyticsInsight(
            summary="No campaign metrics are available yet, so the analytics model is waiting for execution data.",
            trends=["Campaign has not been measured yet."],
        )

    best_channel = summary.best_channel
    best_content_type = summary.best_content_type
    risks: list[str] = []
    trends: list[str] = []

    if summary.totals.ctr < 0.02:
        risks.append("Click-through rate is low relative to the campaign footprint.")
    if summary.totals.conversion_rate < 0.05 and summary.totals.clicks > 0:
        risks.append("Conversion rate is weak after clicks.")
    if best_channel:
        trends.append(f"{best_channel} is currently the strongest channel in the campaign data.")
    if best_content_type:
        trends.append(f"{best_content_type} is the strongest content type in the campaign data.")

    return AnalyticsInsight(
        summary="Campaign performance shows measurable differences across channels and content types.",
        best_channel=best_channel,
        best_content_type=best_content_type,
        risks=risks,
        trends=trends,
    )
