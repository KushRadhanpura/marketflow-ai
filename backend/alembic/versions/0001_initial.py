"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-08-16 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "businesses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("target_audience", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_businesses_id"), "businesses", ["id"], unique=False)

    op.create_table(
        "campaigns",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("business_id", sa.Integer(), sa.ForeignKey("businesses.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("objective", sa.Text(), nullable=False),
        sa.Column("duration", sa.Integer(), nullable=False),
        sa.Column("budget", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_campaigns_id"), "campaigns", ["id"], unique=False)
    op.create_index(op.f("ix_campaigns_business_id"), "campaigns", ["business_id"], unique=False)

    op.create_table(
        "campaign_strategies",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("campaign_id", sa.Integer(), sa.ForeignKey("campaigns.id"), nullable=False, unique=True),
        sa.Column("strategy", sa.Text(), nullable=False),
        sa.Column("positioning", sa.Text(), nullable=False),
        sa.Column("content_pillars", sa.JSON(), nullable=False),
        sa.Column("kpis", sa.JSON(), nullable=False),
        sa.Column("channel_strategy", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_campaign_strategies_id"), "campaign_strategies", ["id"], unique=False)

    op.create_table(
        "content_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("campaign_id", sa.Integer(), sa.ForeignKey("campaigns.id"), nullable=False),
        sa.Column("day", sa.Integer(), nullable=False),
        sa.Column("channel", sa.String(length=120), nullable=False),
        sa.Column("content_type", sa.String(length=120), nullable=False),
        sa.Column("objective", sa.String(length=255), nullable=False),
        sa.Column("hook", sa.Text(), nullable=False),
        sa.Column("caption", sa.Text(), nullable=False),
        sa.Column("cta", sa.Text(), nullable=False),
        sa.Column("creative_brief", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
    )
    op.create_index(op.f("ix_content_items_id"), "content_items", ["id"], unique=False)
    op.create_index(op.f("ix_content_items_campaign_id"), "content_items", ["campaign_id"], unique=False)

    op.create_table(
        "campaign_metrics",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("campaign_id", sa.Integer(), sa.ForeignKey("campaigns.id"), nullable=False),
        sa.Column("content_item_id", sa.Integer(), sa.ForeignKey("content_items.id"), nullable=True),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("channel", sa.String(length=120), nullable=False),
        sa.Column("impressions", sa.Integer(), nullable=False),
        sa.Column("reach", sa.Integer(), nullable=False),
        sa.Column("engagements", sa.Integer(), nullable=False),
        sa.Column("clicks", sa.Integer(), nullable=False),
        sa.Column("conversions", sa.Integer(), nullable=False),
        sa.Column("spend", sa.Numeric(precision=12, scale=2), nullable=False),
    )
    op.create_index(op.f("ix_campaign_metrics_id"), "campaign_metrics", ["id"], unique=False)
    op.create_index(op.f("ix_campaign_metrics_campaign_id"), "campaign_metrics", ["campaign_id"], unique=False)
    op.create_index(op.f("ix_campaign_metrics_content_item_id"), "campaign_metrics", ["content_item_id"], unique=False)
    op.create_index(op.f("ix_campaign_metrics_date"), "campaign_metrics", ["date"], unique=False)

    op.create_table(
        "recommendations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("campaign_id", sa.Integer(), sa.ForeignKey("campaigns.id"), nullable=False),
        sa.Column("category", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("priority", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_recommendations_id"), "recommendations", ["id"], unique=False)
    op.create_index(op.f("ix_recommendations_campaign_id"), "recommendations", ["campaign_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_recommendations_campaign_id"), table_name="recommendations")
    op.drop_index(op.f("ix_recommendations_id"), table_name="recommendations")
    op.drop_table("recommendations")

    op.drop_index(op.f("ix_campaign_metrics_date"), table_name="campaign_metrics")
    op.drop_index(op.f("ix_campaign_metrics_content_item_id"), table_name="campaign_metrics")
    op.drop_index(op.f("ix_campaign_metrics_campaign_id"), table_name="campaign_metrics")
    op.drop_index(op.f("ix_campaign_metrics_id"), table_name="campaign_metrics")
    op.drop_table("campaign_metrics")

    op.drop_index(op.f("ix_content_items_campaign_id"), table_name="content_items")
    op.drop_index(op.f("ix_content_items_id"), table_name="content_items")
    op.drop_table("content_items")

    op.drop_index(op.f("ix_campaign_strategies_id"), table_name="campaign_strategies")
    op.drop_table("campaign_strategies")

    op.drop_index(op.f("ix_campaigns_business_id"), table_name="campaigns")
    op.drop_index(op.f("ix_campaigns_id"), table_name="campaigns")
    op.drop_table("campaigns")

    op.drop_index(op.f("ix_businesses_id"), table_name="businesses")
    op.drop_table("businesses")
