"""add social engagement breakdown columns

Revision ID: 0002_social_metric_breakdown
Revises: 0001_initial
Create Date: 2026-08-16 00:00:00.000001
"""

from alembic import op
import sqlalchemy as sa


revision = "0002_social_metric_breakdown"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("campaign_metrics", sa.Column("likes", sa.Integer(), nullable=False, server_default=sa.text("0")))
    op.add_column("campaign_metrics", sa.Column("comments", sa.Integer(), nullable=False, server_default=sa.text("0")))
    op.add_column("campaign_metrics", sa.Column("shares", sa.Integer(), nullable=False, server_default=sa.text("0")))


def downgrade() -> None:
    op.drop_column("campaign_metrics", "shares")
    op.drop_column("campaign_metrics", "comments")
    op.drop_column("campaign_metrics", "likes")
