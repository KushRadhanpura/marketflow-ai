# API Overview

## Base URL
`/api`

## Endpoints
- `GET /dashboard/summary`
- `GET /businesses`
- `POST /businesses`
- `GET /businesses/{business_id}`
- `GET /campaigns`
- `POST /campaigns`
- `GET /campaigns/{campaign_id}`
- `PATCH /campaigns/{campaign_id}`
- `POST /campaigns/{campaign_id}/generate`
- `GET /campaigns/{campaign_id}/strategy`
- `GET /campaigns/{campaign_id}/content`
- `GET /campaigns/{campaign_id}/recommendations`
- `GET /analytics/campaigns/{campaign_id}`
- `GET /agents/status`

## Notes
- The APIs return structured Pydantic responses.
- The generation endpoint creates strategy, content, and recommendations from the campaign brief.
- Analytics are computed deterministically from campaign metrics.
