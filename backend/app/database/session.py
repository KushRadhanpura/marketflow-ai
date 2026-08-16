from collections.abc import Generator

from sqlalchemy import create_engine, event
from sqlalchemy import text
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings

settings = get_settings()
engine_kwargs: dict[str, object] = {"future": True, "pool_pre_ping": True}
if settings.database_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(
    settings.database_url,
    **engine_kwargs,
)

if settings.database_url.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, connection_record) -> None:  # type: ignore[no-untyped-def]
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def ensure_sqlite_campaign_metric_columns() -> None:
    if not settings.database_url.startswith("sqlite"):
        return

    with engine.begin() as connection:
        existing_columns = {
            row[1]
            for row in connection.execute(text("PRAGMA table_info(campaign_metrics)"))
        }
        for column_name in ["likes", "comments", "shares"]:
            if column_name not in existing_columns:
                connection.execute(text(f"ALTER TABLE campaign_metrics ADD COLUMN {column_name} INTEGER NOT NULL DEFAULT 0"))

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

ensure_sqlite_campaign_metric_columns()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
