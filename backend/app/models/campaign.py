from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    objective: Mapped[str] = mapped_column(Text, nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    budget: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    business: Mapped["Business"] = relationship(back_populates="campaigns")
    strategy: Mapped["CampaignStrategy | None"] = relationship(back_populates="campaign", uselist=False, cascade="all, delete-orphan")
    content_items: Mapped[list["ContentItem"]] = relationship(back_populates="campaign", cascade="all, delete-orphan")
    metrics: Mapped[list["CampaignMetric"]] = relationship(back_populates="campaign", cascade="all, delete-orphan")
    recommendations: Mapped[list["Recommendation"]] = relationship(back_populates="campaign", cascade="all, delete-orphan")
