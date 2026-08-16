from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.business import BusinessCreate, BusinessRead
from app.services.campaign_service import create_business, get_business, list_businesses

router = APIRouter(prefix="/businesses", tags=["businesses"])


@router.get("", response_model=list[BusinessRead], summary="List businesses")
def read_businesses(db: Session = Depends(get_db)) -> list[BusinessRead]:
    return list_businesses(db)


@router.post("", response_model=BusinessRead, status_code=status.HTTP_201_CREATED, summary="Create business")
def create_business_endpoint(payload: BusinessCreate, db: Session = Depends(get_db)) -> BusinessRead:
    try:
        return create_business(db, payload.name, payload.category, payload.description, payload.target_audience)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid business data") from exc


@router.get("/{business_id}", response_model=BusinessRead, summary="Get business")
def read_business(business_id: int, db: Session = Depends(get_db)) -> BusinessRead:
    business = get_business(db, business_id)
    if business is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business not found")
    return business