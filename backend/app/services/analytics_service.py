from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass

from app.schemas.analytics import AnalyticsSummary, ChannelPerformanceItem, ContentPerformanceItem, MetricTotals


def safe_divide(numerator: float, denominator: float) -> float:
    return 0.0 if denominator == 0 else numerator / denominator


@dataclass(slots=True)
class MetricRecord:
    content_item_id: int | None
    channel: str
    content_type: str
    impressions: int
    reach: int
    engagements: int
    clicks: int
    conversions: int
    spend: float


def calculate_metric_totals(records: list[MetricRecord]) -> MetricTotals:
    impressions = sum(record.impressions for record in records)
    reach = sum(record.reach for record in records)
    engagements = sum(record.engagements for record in records)
    clicks = sum(record.clicks for record in records)
    conversions = sum(record.conversions for record in records)
    spend = sum(record.spend for record in records)
    engagement_rate = safe_divide(engagements, reach)
    ctr = safe_divide(clicks, impressions)
    conversion_rate = safe_divide(conversions, clicks)
    cost_per_conversion = safe_divide(spend, conversions)
    return MetricTotals(
        impressions=impressions,
        reach=reach,
        engagements=engagements,
        clicks=clicks,
        conversions=conversions,
        spend=round(spend, 2),
        engagement_rate=round(engagement_rate, 4),
        ctr=round(ctr, 4),
        conversion_rate=round(conversion_rate, 4),
        cost_per_conversion=round(cost_per_conversion, 2),
        roi=0.0,
    )


def build_channel_performance(records: list[MetricRecord]) -> list[ChannelPerformanceItem]:
    buckets: dict[str, list[MetricRecord]] = defaultdict(list)
    for record in records:
        buckets[record.channel].append(record)

    performance: list[ChannelPerformanceItem] = []
    for channel, channel_records in sorted(buckets.items()):
        totals = calculate_metric_totals(channel_records)
        performance.append(
            ChannelPerformanceItem(
                channel=channel,
                impressions=totals.impressions,
                reach=totals.reach,
                engagements=totals.engagements,
                clicks=totals.clicks,
                conversions=totals.conversions,
                spend=totals.spend,
                engagement_rate=totals.engagement_rate,
                ctr=totals.ctr,
                conversion_rate=totals.conversion_rate,
                cost_per_conversion=totals.cost_per_conversion,
                roi=totals.roi,
            )
        )
    return performance


def build_content_performance(records: list[MetricRecord]) -> list[ContentPerformanceItem]:
    buckets: dict[tuple[int | None, str], list[MetricRecord]] = defaultdict(list)
    for record in records:
        buckets[(record.content_item_id, record.content_type)].append(record)

    performance: list[ContentPerformanceItem] = []
    for (content_item_id, content_type), content_records in sorted(buckets.items(), key=lambda item: item[0][1]):
        totals = calculate_metric_totals(content_records)
        performance.append(
            ContentPerformanceItem(
                content_item_id=content_item_id,
                label=content_type,
                impressions=totals.impressions,
                engagements=totals.engagements,
                clicks=totals.clicks,
                conversions=totals.conversions,
                engagement_rate=totals.engagement_rate,
                ctr=totals.ctr,
                conversion_rate=totals.conversion_rate,
                spend=totals.spend,
            )
        )
    return performance


def summarize_analytics(campaign_id: int, records: list[MetricRecord]) -> AnalyticsSummary:
    totals = calculate_metric_totals(records)
    channel_performance = build_channel_performance(records)
    content_performance = build_content_performance(records)
    best_channel = max(channel_performance, key=lambda item: item.engagement_rate, default=None)
    best_content_type = max(content_performance, key=lambda item: item.ctr, default=None)
    return AnalyticsSummary(
        campaign_id=campaign_id,
        totals=totals,
        channel_performance=channel_performance,
        content_performance=content_performance,
        best_channel=best_channel.channel if best_channel else None,
        best_content_type=best_content_type.label if best_content_type else None,
    )
