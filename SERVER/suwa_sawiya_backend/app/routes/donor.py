"""Donor routes - FR-D-01 to FR-D-07"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from datetime import datetime
from app.models import db
from app.models.user import User, Donor
from app.models.campaign import Campaign, Donation
from app.models.other import Transaction
from app.utils.response import success_response, error_response, paginated_response
from app.utils.auth import role_required
from app.utils.payment import create_payment_intent, verify_payment_intent

donor_bp = Blueprint('donor', __name__, url_prefix='/api/donor')


# FR-D-01: Browse medical fundraising campaigns
@donor_bp.route('/campaigns', methods=['GET'])
def get_campaigns():
    """Browse all campaigns"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Get approved campaigns
        campaigns = Campaign.query.filter_by(status='approved').paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        items = [campaign.to_dict() for campaign in campaigns.items]
        
        return paginated_response(
            items=items,
            total=campaigns.total,
            page=page,
            per_page=per_page,
            message='Campaigns retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


# FR-D-02: Search and filter campaigns by urgency and category
@donor_bp.route('/campaigns/search', methods=['GET'])
def search_campaigns():
    """Search and filter campaigns"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        urgency = request.args.get('urgency')
        category = request.args.get('category')
        search_query = request.args.get('search')
        
        query = Campaign.query.filter_by(status='approved')
        
        # Filter by urgency
        if urgency:
            query = query.filter_by(urgency=urgency)
        
        # Filter by category
        if category:
            query = query.filter_by(category=category)
        
        # Search by title or beneficiary name
        if search_query:
            query = query.filter(
                or_(
                    Campaign.title.ilike(f'%{search_query}%'),
                    Campaign.beneficiary_name.ilike(f'%{search_query}%'),
                    Campaign.beneficiary_medical_condition.ilike(f'%{search_query}%')
                )
            )
        
        campaigns = query.paginate(page=page, per_page=per_page, error_out=False)
        
        items = [campaign.to_dict() for campaign in campaigns.items]
        
        return paginated_response(
            items=items,
            total=campaigns.total,
            page=page,
            per_page=per_page,
            message='Search results retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


# FR-D-03: Display prioritized campaigns by urgency
@donor_bp.route('/campaigns/priority', methods=['GET'])
def get_priority_campaigns():
    """Get campaigns prioritized by urgency"""
    try:
        # Order by urgency (critical > high > medium > low) and funds needed
        urgency_order = {'critical': 1, 'high': 2, 'medium': 3, 'low': 4}
        
        campaigns = Campaign.query.filter_by(status='approved').all()
        
        # Sort by urgency then by remaining amount
        sorted_campaigns = sorted(
            campaigns,
            key=lambda x: (urgency_order.get(x.urgency, 5), -(x.target_amount - x.funds_raised))
        )
        
        # Limit to top 20 priority campaigns
        priority_campaigns = sorted_campaigns[:20]
        
        items = [campaign.to_dict() for campaign in priority_campaigns]
        
        return success_response(
            data=items,
            message='Priority campaigns retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


# FR-D-04: Display campaign details
@donor_bp.route('/campaigns/<campaign_id>', methods=['GET'])
def get_campaign_details(campaign_id):
    """Get detailed campaign information"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return error_response('Campaign not found', 404)
        
        return success_response(
            data=campaign.to_dict(include_donations=True),
            message='Campaign details retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


# FR-D-05 & FR-D-06: Make secure donations and anonymous donations
@donor_bp.route('/donate', methods=['POST'])
@jwt_required()
def create_donation():
    """Create a donation"""
    try:
        user_id = get_jwt_identity()
        donor = User.query.get(user_id)
        
        if not donor or donor.user_type != 'donor':
            return error_response('Unauthorized', 401)
        
        data = request.get_json()
        
        if not data.get('campaign_id') or not data.get('amount'):
            return error_response('Campaign ID and amount required', 400)
        
        campaign = Campaign.query.get(data['campaign_id'])
        if not campaign:
            return error_response('Campaign not found', 404)
        
        amount = float(data['amount'])
        if amount <= 0:
            return error_response('Amount must be greater than 0', 400)
        
        # Create payment intent with Stripe
        payment_intent, payment_error = create_payment_intent(
            amount=amount,
            description=f"Donation to campaign: {campaign.title}"
        )
        
        if payment_error:
            return error_response(f'Payment error: {payment_error}', 400)
        
        # Create donation record
        is_anonymous = data.get('is_anonymous', False)
        donation = Donation(
            campaign_id=campaign.id,
            donor_id=None if is_anonymous else donor.id,
            amount=amount,
            is_anonymous=is_anonymous,
            donor_message=data.get('message'),
            transaction_id=payment_intent['id'],
            status='pending'
        )
        
        db.session.add(donation)
        db.session.commit()
        
        return success_response(
            data={
                'donation_id': str(donation.id),
                'client_secret': payment_intent['client_secret'],
                'amount': amount,
                'currency': payment_intent['currency'].upper()
            },
            message='Donation created. Please complete payment.',
            status_code=201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@donor_bp.route('/donations/<donation_id>/confirm', methods=['POST'])
@jwt_required()
def confirm_donation(donation_id):
    """Confirm donation payment"""
    try:
        user_id = get_jwt_identity()
        donor = User.query.get(user_id)
        
        if not donor:
            return error_response('User not found', 401)
        
        donation = Donation.query.get(donation_id)
        if not donation:
            return error_response('Donation not found', 404)
        
        # Verify payment with Stripe
        payment_intent, error = verify_payment_intent(donation.transaction_id)
        
        if error:
            return error_response(f'Payment verification failed: {error}', 400)
        
        if payment_intent['status'] != 'succeeded':
            return error_response(f'Payment status: {payment_intent["status"]}', 400)
        
        # Update donation status
        donation.status = 'completed'
        donation.completed_at = datetime.utcnow()
        
        # Create transaction record
        transaction = Transaction(
            donation_id=donation.id,
            payment_method='stripe',
            transaction_reference=payment_intent['id'],
            amount=donation.amount,
            currency=payment_intent['currency'].upper(),
            status='success',
            processed_at=datetime.utcnow()
        )
        
        # Update campaign funds
        campaign = donation.campaign
        campaign.funds_raised += donation.amount
        
        # Update donor total
        if not donation.is_anonymous and isinstance(donor, Donor):
            donor.total_donated += donation.amount
        
        db.session.add(transaction)
        db.session.commit()
        
        # FR-D-07: Provide donation confirmation
        return success_response(
            data={
                'donation': donation.to_dict(),
                'campaign_progress': {
                    'funds_raised': campaign.funds_raised,
                    'target_amount': campaign.target_amount,
                    'progress_percentage': campaign.get_progress_percentage()
                }
            },
            message='Donation confirmed successfully'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@donor_bp.route('/donations', methods=['GET'])
@jwt_required()
def get_donor_donations():
    """Get donor's donation history"""
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        donations = Donation.query.filter(
            and_(
                Donation.donor_id == user_id,
                Donation.is_anonymous == False
            )
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        items = [donation.to_dict() for donation in donations.items]
        
        return paginated_response(
            items=items,
            total=donations.total,
            page=page,
            per_page=per_page,
            message='Donations retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


@donor_bp.route('/campaigns/<campaign_id>/updates', methods=['GET'])
def get_campaign_updates(campaign_id):
    """FR-D-07: Get campaign progress updates"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return error_response('Campaign not found', 404)
        
        donation_count = Donation.query.filter_by(
            campaign_id=campaign_id,
            status='completed'
        ).count()
        
        return success_response(
            data={
                'campaign_id': str(campaign.id),
                'title': campaign.title,
                'funds_raised': campaign.funds_raised,
                'target_amount': campaign.target_amount,
                'progress_percentage': campaign.get_progress_percentage(),
                'donor_count': donation_count,
                'remaining_amount': campaign.target_amount - campaign.funds_raised,
                'deadline': campaign.deadline.isoformat() if campaign.deadline else None
            },
            message='Campaign updates retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)
