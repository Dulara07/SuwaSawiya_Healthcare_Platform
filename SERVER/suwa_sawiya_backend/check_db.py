import os
from app import create_app, db
from app.models.user import User, Donor, Partner, Admin
from app.models.campaign import Campaign, Donation
from app.models.other import Document, Transaction, Disbursement, FraudReport

def check_db():
    """Check database contents"""
    app = create_app(os.getenv('FLASK_ENV', 'development'))

    with app.app_context():
        print("Checking database contents...")

        # Check users
        users = User.query.all()
        print(f"Total users: {len(users)}")
        for user in users:
            print(f"- {user.email} ({user.user_type})")

        # Check donors
        donors = Donor.query.all()
        print(f"Total donors: {len(donors)}")

        # Check partners
        partners = Partner.query.all()
        print(f"Total partners: {len(partners)}")

        # Check admins
        admins = Admin.query.all()
        print(f"Total admins: {len(admins)}")

        # Check campaigns
        campaigns = Campaign.query.all()
        print(f"Total campaigns: {len(campaigns)}")

        # Check donations
        donations = Donation.query.all()
        print(f"Total donations: {len(donations)}")

        # Check transactions
        transactions = Transaction.query.all()
        print(f"Total transactions: {len(transactions)}")
        for tx in transactions:
            print(f"- Transaction: {tx.transaction_reference}, Amount: {tx.amount}")

        # Check documents
        documents = Document.query.all()
        print(f"Total documents: {len(documents)}")

        # Check disbursements
        disbursements = Disbursement.query.all()
        print(f"Total disbursements: {len(disbursements)}")

        # Check fraud reports
        fraud_reports = FraudReport.query.all()
        print(f"Total fraud reports: {len(fraud_reports)}")

if __name__ == '__main__':
    check_db()
