from fastapi import APIRouter

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("/status", summary="Get agent workflow status")
def agent_status() -> dict[str, str]:
    return {"status": "ready", "workflow": "business -> strategy -> content -> planning -> analytics -> optimization"}
