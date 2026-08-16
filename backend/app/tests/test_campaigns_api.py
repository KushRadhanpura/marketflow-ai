from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_business_and_campaign_round_trip() -> None:
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
    campaign = campaign_response.json()
    assert campaign["business_id"] == business_id
    assert campaign["status"] == "draft"

    get_response = client.get(f"/api/campaigns/{campaign['id']}")
    assert get_response.status_code == 200
    assert get_response.json()["name"] == "Weekend Student Boost"


def test_create_campaign_rejects_missing_business() -> None:
    response = client.post(
        "/api/campaigns",
        json={
            "business_id": 999999,
            "name": "Invalid Campaign",
            "objective": "Should fail",
            "duration": 7,
            "budget": 1000,
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid campaign data"
