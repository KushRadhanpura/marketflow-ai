from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_generate_campaign_creates_strategy_content_and_recommendations() -> None:
    business_response = client.post(
        "/api/businesses",
        json={
            "name": "Bean & Brew Café",
            "category": "Café",
            "description": "A neighborhood café serving students and young professionals.",
            "target_audience": "18-25 year old college students",
        },
    )
    assert business_response.status_code == 201
    business_id = business_response.json()["id"]

    campaign_response = client.post(
        "/api/campaigns",
        json={
            "business_id": business_id,
            "name": "Weekend Student Boost",
            "objective": "Increase weekend orders",
            "duration": 7,
            "budget": 10000,
        },
    )
    assert campaign_response.status_code == 201
    campaign_id = campaign_response.json()["id"]

    generate_response = client.post(f"/api/campaigns/{campaign_id}/generate")
    assert generate_response.status_code == 200
    payload = generate_response.json()
    assert payload["campaign_id"] == campaign_id
    assert len(payload["workflow_steps"]) == 6
    assert len(payload["content_items"]) >= 1
    assert len(payload["recommendations"]) >= 1

    strategy_response = client.get(f"/api/campaigns/{campaign_id}/strategy")
    assert strategy_response.status_code == 200
    assert strategy_response.json()["campaign_id"] == campaign_id

    content_response = client.get(f"/api/campaigns/{campaign_id}/content")
    assert content_response.status_code == 200
    assert len(content_response.json()) >= 1

    recommendations_response = client.get(f"/api/campaigns/{campaign_id}/recommendations")
    assert recommendations_response.status_code == 200
    assert len(recommendations_response.json()) >= 1
