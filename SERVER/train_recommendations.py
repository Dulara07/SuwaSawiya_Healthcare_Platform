from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parent))

from app.models import base, campaign, document, donation, fraud_report, user, interaction, recommendation_impression  # noqa: F401
from app.services.recommendations import engine
from app.utils.db import SessionLocal


def main() -> None:
    db = SessionLocal()
    try:
        artifact = engine.train_from_db(db)
        print(f"Recommendation artifact saved to {engine.artifact_path}")
        print(f"Generated at: {artifact['generated_at']}")
    finally:
        db.close()


if __name__ == "__main__":
    main()