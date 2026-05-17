"""Database seeding script with dummy data"""
import os
from datetime import datetime, timedelta
from app import create_app, db
from app.models.user import User, Donor, Partner, Admin
from app.models.campaign import Campaign, Donation
from app.models.other import Document, Transaction, Disbursement, FraudReport


def seed_db():
    """Seed database with dummy data"""
    app = create_app(os.getenv('FLASK_ENV', 'development'))

    with app.app_context():
        # Check if data already exists
        existing_users = User.query.count()
        if existing_users > 0:
            print("Database already contains data. Skipping seeding.")
            return

        print("Seeding database with dummy data...")

        # Create dummy donors
        donors_data = [
            {
                'email': 'john.doe@example.com',
                'first_name': 'John',
                'last_name': 'Doe',
                'phone': '+94712345678',
                'is_anonymous': False,
                'total_donated': 1500.00,
                'notification_preferences': {'email': True, 'sms': False}
            },
            {
                'email': 'jane.smith@example.com',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'phone': '+94787654321',
                'is_anonymous': False,
                'total_donated': 2500.00,
                'notification_preferences': {'email': True, 'sms': True}
            },
            {
                'email': 'anonymous@example.com',
                'first_name': 'Anonymous',
                'last_name': 'Donor',
                'phone': None,
                'is_anonymous': True,
                'total_donated': 500.00,
                'notification_preferences': {'email': False, 'sms': False}
            }
        ]

        donors = []
        for donor_data in donors_data:
            donor = Donor(
                email=donor_data['email'],
                first_name=donor_data['first_name'],
                last_name=donor_data['last_name'],
                phone=donor_data['phone'],
                is_anonymous=donor_data['is_anonymous'],
                total_donated=donor_data['total_donated'],
                notification_preferences=donor_data['notification_preferences'],
                is_active=True,
                is_verified=True
            )
            donor.set_password('password123')
            donors.append(donor)
            db.session.add(donor)

        # Create dummy partners
        partners_data = [
            {
                'email': 'hospital@general.lk',
                'first_name': 'Dr. Sarah',
                'last_name': 'Johnson',
                'phone': '+94112345678',
                'organization_name': 'General Hospital Colombo',
                'organization_type': 'hospital',
                'registration_number': 'HOSP001',
                'address': '123 Main Street, Colombo',
                'city': 'Colombo',
                'country': 'Sri Lanka',
                'bank_account_number': '1234567890',
                'bank_name': 'Bank of Ceylon'
            },
            {
                'email': 'ngo@healthcare.org',
                'first_name': 'Michael',
                'last_name': 'Brown',
                'phone': '+94123456789',
                'organization_name': 'Healthcare NGO',
                'organization_type': 'ngo',
                'registration_number': 'NGO001',
                'address': '456 Health Avenue, Kandy',
                'city': 'Kandy',
                'country': 'Sri Lanka',
                'bank_account_number': '0987654321',
                'bank_name': 'People\'s Bank'
            }
        ]

        partners = []
        for partner_data in partners_data:
            partner = Partner(
                email=partner_data['email'],
                first_name=partner_data['first_name'],
                last_name=partner_data['last_name'],
                phone=partner_data['phone'],
                organization_name=partner_data['organization_name'],
                organization_type=partner_data['organization_type'],
                registration_number=partner_data['registration_number'],
                address=partner_data['address'],
                city=partner_data['city'],
                country=partner_data['country'],
                bank_account_number=partner_data['bank_account_number'],
                bank_name=partner_data['bank_name'],
                is_active=True,
                is_verified=True
            )
            partner.set_password('password123')
            partners.append(partner)
            db.session.add(partner)

        # Create additional admin
        admin2 = Admin(
            email='admin2@suwa.com',
            first_name='Admin',
            last_name='Two',
            role='admin',
            is_active=True,
            is_verified=True
        )
        admin2.set_password('admin123')
        db.session.add(admin2)

        db.session.commit()
        print("Users created successfully!")

        # Create dummy campaigns
        campaigns_data = [
            {
                'title': 'Heart Surgery for Young Patient',
                'description': 'A 25-year-old patient needs urgent heart surgery to correct a congenital heart defect.',
                'category': 'surgery',
                'urgency': 'critical',
                'target_amount': 50000.00,
                'funds_raised': 35000.00,
                'status': 'approved',
                'beneficiary_name': 'Alex Johnson',
                'beneficiary_age': 25,
                'beneficiary_medical_condition': 'Congenital heart defect requiring open-heart surgery',
                'partner_id': partners[0].id,
                'deadline': datetime.utcnow() + timedelta(days=30)
            },
            {
                'title': 'Cancer Treatment Support',
                'description': 'Help fund chemotherapy treatment for a breast cancer patient.',
                'category': 'treatment',
                'urgency': 'high',
                'target_amount': 75000.00,
                'funds_raised': 45000.00,
                'status': 'approved',
                'beneficiary_name': 'Maria Garcia',
                'beneficiary_age': 45,
                'beneficiary_medical_condition': 'Stage 2 breast cancer requiring chemotherapy',
                'partner_id': partners[0].id,
                'deadline': datetime.utcnow() + timedelta(days=45)
            },
            {
                'title': 'Emergency Dialysis Support',
                'description': 'Urgent dialysis treatment needed for kidney failure patient.',
                'category': 'emergency',
                'urgency': 'critical',
                'target_amount': 25000.00,
                'funds_raised': 15000.00,
                'status': 'approved',
                'beneficiary_name': 'Robert Wilson',
                'beneficiary_age': 60,
                'beneficiary_medical_condition': 'Acute kidney failure requiring dialysis',
                'partner_id': partners[1].id,
                'deadline': datetime.utcnow() + timedelta(days=15)
            },
            {
                'title': 'Pediatric Bone Marrow Transplant',
                'description': '8-year-old child needs bone marrow transplant for leukemia treatment.',
                'category': 'surgery',
                'urgency': 'high',
                'target_amount': 100000.00,
                'funds_raised': 25000.00,
                'status': 'pending',
                'beneficiary_name': 'Emma Davis',
                'beneficiary_age': 8,
                'beneficiary_medical_condition': 'Acute lymphoblastic leukemia requiring bone marrow transplant',
                'partner_id': partners[0].id,
                'deadline': datetime.utcnow() + timedelta(days=60)
            },
            {
                'title': 'Diabetes Medication Support',
                'description': 'Monthly insulin and medication support for diabetic patient.',
                'category': 'medication',
                'urgency': 'medium',
                'target_amount': 15000.00,
                'funds_raised': 8000.00,
                'status': 'approved',
                'beneficiary_name': 'David Chen',
                'beneficiary_age': 55,
                'beneficiary_medical_condition': 'Type 1 diabetes requiring insulin therapy',
                'partner_id': partners[1].id,
                'deadline': datetime.utcnow() + timedelta(days=90)
            }
        ]

        campaigns = []
        for campaign_data in campaigns_data:
            campaign = Campaign(**campaign_data)
            campaigns.append(campaign)
            db.session.add(campaign)

        db.session.commit()
        print("Campaigns created successfully!")

        # Create dummy donations
        donations_data = [
            {
                'campaign_id': campaigns[0].id,
                'donor_id': donors[0].id,
                'amount': 500.00,
                'is_anonymous': False,
                'status': 'completed',
                'transaction_id': 'txn_001',
                'donor_message': 'Wishing you a speedy recovery!'
            },
            {
                'campaign_id': campaigns[0].id,
                'donor_id': donors[1].id,
                'amount': 1000.00,
                'is_anonymous': False,
                'status': 'completed',
                'transaction_id': 'txn_002',
                'donor_message': 'Stay strong!'
            },
            {
                'campaign_id': campaigns[1].id,
                'donor_id': donors[0].id,
                'amount': 750.00,
                'is_anonymous': False,
                'status': 'completed',
                'transaction_id': 'txn_003',
                'donor_message': 'You are not alone in this fight.'
            },
            {
                'campaign_id': campaigns[2].id,
                'donor_id': donors[2].id,
                'amount': 500.00,
                'is_anonymous': True,
                'status': 'completed',
                'transaction_id': 'txn_004',
                'donor_message': None
            },
            {
                'campaign_id': campaigns[4].id,
                'donor_id': donors[1].id,
                'amount': 300.00,
                'is_anonymous': False,
                'status': 'completed',
                'transaction_id': 'txn_005',
                'donor_message': 'Hope this helps with your treatment.'
            }
        ]

        donations = []
        for donation_data in donations_data:
            donation = Donation(**donation_data)
            donation.completed_at = datetime.utcnow()
            donations.append(donation)
            db.session.add(donation)

        db.session.commit()
        print("Donations created successfully!")

        # Create dummy transactions
        for i, donation in enumerate(donations):
            transaction = Transaction(
                donation_id=donation.id,
                amount=donation.amount,
                payment_method='stripe',
                status='completed',
                transaction_reference=f'stripe_txn_{i+1:03d}'
            )
            db.session.add(transaction)

        db.session.commit()
        print("Transactions created successfully!")

        # Create dummy documents
        documents_data = [
            {
                'campaign_id': campaigns[0].id,
                'partner_id': partners[0].id,
                'document_type': 'medical_report',
                'file_name': 'heart_surgery_report.pdf',
                'file_path': '/uploads/medical_reports/heart_surgery_report.pdf',
                'file_size': 2048576
            },
            {
                'campaign_id': campaigns[1].id,
                'partner_id': partners[0].id,
                'document_type': 'medical_certificate',
                'file_name': 'cancer_diagnosis.pdf',
                'file_path': '/uploads/medical_reports/cancer_diagnosis.pdf',
                'file_size': 1536000
            },
            {
                'campaign_id': campaigns[2].id,
                'partner_id': partners[1].id,
                'document_type': 'verification_document',
                'file_name': 'kidney_failure_report.pdf',
                'file_path': '/uploads/medical_reports/kidney_failure_report.pdf',
                'file_size': 1024000
            }
        ]

        for doc_data in documents_data:
            document = Document(**doc_data)
            db.session.add(document)

        db.session.commit()
        print("Documents created successfully!")

        # Create dummy disbursements
        disbursements_data = [
            {
                'campaign_id': campaigns[0].id,
                'partner_id': partners[0].id,
                'amount': 30000.00,
                'status': 'approved',
                'bank_account_number': '1234567890',
                'bank_name': 'Bank of Ceylon'
            },
            {
                'campaign_id': campaigns[1].id,
                'partner_id': partners[0].id,
                'amount': 40000.00,
                'status': 'pending',
                'bank_account_number': '1234567890',
                'bank_name': 'Bank of Ceylon'
            }
        ]

        for disb_data in disbursements_data:
            disbursement = Disbursement(**disb_data)
            db.session.add(disbursement)

        db.session.commit()
        print("Disbursements created successfully!")

        # Create dummy fraud reports
        fraud_reports_data = [
            {
                'campaign_id': campaigns[3].id,
                'reported_by_id': donors[0].id,
                'description': 'Campaign seems suspicious - beneficiary details unclear',
                'status': 'investigating',
                'evidence_file': 'evidence1.zip'
            },
            {
                'campaign_id': campaigns[4].id,
                'reported_by_id': donors[1].id,
                'description': 'This appears to be a duplicate of another campaign',
                'status': 'dismissed',
                'evidence_file': 'evidence2.zip'
            }
        ]

        for fraud_data in fraud_reports_data:
            fraud_report = FraudReport(**fraud_data)
            db.session.add(fraud_report)

        db.session.commit()
        print("Fraud reports created successfully!")

        print("\nDummy data seeding complete!")
        print("Created:")
        print(f"- {len(donors)} donors")
        print(f"- {len(partners)} partners")
        print(f"- 1 additional admin")
        print(f"- {len(campaigns)} campaigns")
        print(f"- {len(donations)} donations")
        print(f"- {len(donations)} transactions")
        print(f"- {len(documents_data)} documents")
        print(f"- {len(disbursements_data)} disbursements")
        print(f"- {len(fraud_reports_data)} fraud reports")


if __name__ == '__main__':
    seed_db()
