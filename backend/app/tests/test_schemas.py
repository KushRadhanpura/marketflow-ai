from app.schemas.campaign import CampaignCreate


def test_campaign_create_schema_accepts_expected_payload() -> None:
    payload = CampaignCreate(business_id=1, name="Weekend Boost", objective="Increase weekend orders", duration=7, budget=10000)
    assert payload.business_id == 1
    assert payload.status == "draft"
