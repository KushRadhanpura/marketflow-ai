from app.services.analytics_service import MetricRecord, calculate_metric_totals, summarize_analytics


def test_safe_metric_calculation_handles_zero_denominators() -> None:
    totals = calculate_metric_totals([])
    assert totals.impressions == 0
    assert totals.engagement_rate == 0.0
    assert totals.ctr == 0.0
    assert totals.conversion_rate == 0.0
    assert totals.cost_per_conversion == 0.0


def test_summarize_analytics_finds_best_channel_and_content_type() -> None:
    records = [
        MetricRecord(content_item_id=1, channel="Instagram", content_type="Reel", impressions=1000, reach=800, engagements=120, clicks=60, conversions=6, spend=500.0),
        MetricRecord(content_item_id=2, channel="WhatsApp", content_type="Story", impressions=500, reach=420, engagements=35, clicks=12, conversions=2, spend=150.0),
    ]
    summary = summarize_analytics(campaign_id=7, records=records)
    assert summary.campaign_id == 7
    assert summary.totals.impressions == 1500
    assert summary.best_channel == "Instagram"
    assert summary.best_content_type == "Reel"
