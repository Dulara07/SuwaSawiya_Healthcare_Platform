from app.utils.db import SessionLocal
# Import all model modules so SQLAlchemy relationships can be resolved
import app.models.user
import app.models.campaign
import app.models.donation
import app.models.document
import app.models.fraud_report

from app.models.user import User
from app.models.campaign import Campaign


def main():
    session = SessionLocal()
    try:
        # create an owner user
        owner = User(
            username="partner1",
            email="partner1@example.com",
            hashed_password="hashedpassword",
            full_name="Partner One",
            role="partner"
        )
        session.add(owner)
        session.commit()
        session.refresh(owner)

        campaigns = []
        for i in range(1, 6):
            c = Campaign(
                title=f"Dummy Campaign {i}",
                description=f"This is a dummy description for campaign {i}.",
                medical_urgency=(i % 5) + 1,
                time_sensitivity=((i + 1) % 5) + 1,
                target_amount=1000.0 * i,
                raised_amount=100.0 * i,
                status="approved",
                priority_score=0.0,
                owner_id=owner.id
            )
            session.add(c)
            campaigns.append(c)

        session.commit()
        for c in campaigns:
            session.refresh(c)

        print("Inserted campaigns:", [ {"id": c.id, "title": c.title} for c in campaigns])
    except Exception as e:
        session.rollback()
        print("ERROR:", e)
    finally:
        session.close()


if __name__ == "__main__":
    main()
