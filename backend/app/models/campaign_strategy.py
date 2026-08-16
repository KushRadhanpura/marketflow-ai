from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class CampaignStrategy(Base):
    __tablename__ = "campaign_strategies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id"), nullable=False, unique=True)
    strategy: Mapped[str] = mapped_column(Text, nullable=False)
    positioning: Mapped[str] = mapped_column(Text, nullable=False)
    content_pillars: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    kpis: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    channel_strategy: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    campaign: Mapped["Campaign"] = relationship(back_populates="strategy")
