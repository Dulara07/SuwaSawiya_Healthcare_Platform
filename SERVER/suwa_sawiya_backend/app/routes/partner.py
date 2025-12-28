"""Partner and Beneficiary routes - FR-P-01 to FR-P-05"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models import db
from app.models.user import User, Partner
from app.models.campaign import Campaign, Donation
from app.models.other import Document, Disbursement
from app.utils.response import success_response, error_response, paginated_response
from app.utils.auth import role_required
from app.utils.file_handler import save_uploaded_file, allowed_file, delete_file
from config import Config

partner_bp = Blueprint('partner', __name__, url_prefix='/api/partner')


# FR-P-01: Register and create campaigns
@partner_bp.route('/campaigns', methods=['POST'])
@jwt_required()
@role_required('partner')
def create_campaign():
    """Create a new fundraising campaign"""
    try:
        partner_id = get_jwt_identity()
        partner = Partner.query.get(partner_id)
        
        if not partner:
            return error_response('Partner not found', 404)
        
        data = request.get_json()
        
        required_fields = ['title', 'category', 'urgency', 'target_amount', 'beneficiary_name', 'beneficiary_medical_condition']
        if not all(data.get(field) for field in required_fields):
            return error_response('Missing required fields', 400)
        
        # Handle file uploads
        cover_image_path = None
        medical_document_path = None
        
        if 'cover_image' in request.files:
            file = request.files['cover_image']
            if file and allowed_file(file.filename, {'png', 'jpg', 'jpeg', 'gif'}):
                cover_image_path, error = save_uploaded_file(
                    file, 
                    Config.UPLOAD_FOLDER, 
                    {'png', 'jpg', 'jpeg', 'gif'}
                )
                if error:
                    return error_response(f'Image upload error: {error}', 400)
        
        if 'medical_document' in request.files:
            file = request.files['medical_document']
            if file and allowed_file(file.filename, {'pdf', 'doc', 'docx'}):
                medical_document_path, error = save_uploaded_file(
                    file, 
                    Config.UPLOAD_FOLDER, 
                    {'pdf', 'doc', 'docx'}
                )
                if error:
                    return error_response(f'Document upload error: {error}', 400)
        
        # Create campaign
        campaign = Campaign(
            title=data['title'],
            description=data.get('description'),
            category=data['category'],
            urgency=data['urgency'],
            target_amount=float(data['target_amount']),
            beneficiary_name=data['beneficiary_name'],
            beneficiary_age=data.get('beneficiary_age'),
            beneficiary_medical_condition=data['beneficiary_medical_condition'],
            partner_id=partner.id,
            cover_image=cover_image_path,
            medical_document=medical_document_path,
            status='pending'  # Requires admin approval
        )
        
        db.session.add(campaign)
        db.session.flush()
        
        # If medical document uploaded, create document record
        if medical_document_path:
            doc = Document(
                campaign_id=campaign.id,
                document_type='medical_certificate',
                file_path=medical_document_path,
                file_name=request.files.get('medical_document').filename if 'medical_document' in request.files else 'document'
            )
            db.session.add(doc)
        
        db.session.commit()
        
        return success_response(
            data=campaign.to_dict(),
            message='Campaign created successfully. Pending admin approval.',
            status_code=201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


# FR-P-02: Allow hospitals/NGOs/PHIs to register patients
@partner_bp.route('/register-beneficiary', methods=['POST'])
@jwt_required()
@role_required('partner')
def register_beneficiary():
    """Register a patient/beneficiary on behalf of partner"""
    try:
        partner_id = get_jwt_identity()
        partner = Partner.query.get(partner_id)
        
        if not partner:
            return error_response('Partner not found', 404)
        
        data = request.get_json()
        
        # This endpoint creates a campaign for the beneficiary
        # It's essentially the same as creating a campaign but with pre-filled beneficiary info
        required_fields = ['category', 'urgency', 'target_amount', 'beneficiary_name', 'beneficiary_medical_condition']
        if not all(data.get(field) for field in required_fields):
            return error_response('Missing required fields', 400)
        
        campaign = Campaign(
            title=f"Medical Campaign for {data['beneficiary_name']}",
            description=data.get('description'),
            category=data['category'],
            urgency=data['urgency'],
            target_amount=float(data['target_amount']),
            beneficiary_name=data['beneficiary_name'],
            beneficiary_age=data.get('beneficiary_age'),
            beneficiary_medical_condition=data['beneficiary_medical_condition'],
            partner_id=partner.id,
            status='pending'
        )
        
        db.session.add(campaign)
        db.session.commit()
        
        return success_response(
            data=campaign.to_dict(),
            message='Beneficiary registered successfully. Pending admin approval.',
            status_code=201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


# FR-P-03: Upload medical and verification documents
@partner_bp.route('/campaigns/<campaign_id>/documents', methods=['POST'])
@jwt_required()
@role_required('partner')
def upload_document(campaign_id):
    """Upload medical or verification documents for a campaign"""
    try:
        partner_id = get_jwt_identity()
        partner = Partner.query.get(partner_id)
        
        campaign = Campaign.query.get(campaign_id)
        if not campaign or campaign.partner_id != partner.id:
            return error_response('Campaign not found or unauthorized', 404)
        
        if 'document' not in request.files:
            return error_response('Document file required', 400)
        
        file = request.files['document']
        document_type = request.form.get('document_type', 'medical_certificate')
        
        file_path, error = save_uploaded_file(
            file, 
            Config.UPLOAD_FOLDER, 
            Config.ALLOWED_EXTENSIONS
        )
        
        if error:
            return error_response(f'Upload error: {error}', 400)
        
        # Create document record
        document = Document(
            campaign_id=campaign.id,
            document_type=document_type,
            file_path=file_path,
            file_name=file.filename,
            file_size=len(file.read())
        )
        
        db.session.add(document)
        db.session.commit()
        
        return success_response(
            data=document.to_dict(),
            message='Document uploaded successfully',
            status_code=201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


# FR-P-04: View campaign progress
@partner_bp.route('/campaigns/<campaign_id>/progress', methods=['GET'])
@jwt_required()
@role_required('partner')
def get_campaign_progress(campaign_id):
    """Get campaign progress and statistics"""
    try:
        partner_id = get_jwt_identity()
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign or campaign.partner_id != partner_id:
            return error_response('Campaign not found or unauthorized', 404)
        
        # Get donation statistics
        completed_donations = Donation.query.filter_by(
            campaign_id=campaign_id,
            status='completed'
        ).all()
        
        total_donors = len(set(d.donor_id for d in completed_donations if d.donor_id))
        anonymous_donations_count = sum(1 for d in completed_donations if d.is_anonymous)
        
        return success_response(
            data={
                'campaign_id': str(campaign.id),
                'title': campaign.title,
                'status': campaign.status,
                'funds_raised': campaign.funds_raised,
                'target_amount': campaign.target_amount,
                'remaining_amount': campaign.target_amount - campaign.funds_raised,
                'progress_percentage': campaign.get_progress_percentage(),
                'total_donors': total_donors,
                'donation_count': len(completed_donations),
                'anonymous_donations': anonymous_donations_count,
                'created_at': campaign.created_at.isoformat(),
                'deadline': campaign.deadline.isoformat() if campaign.deadline else None
            },
            message='Campaign progress retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


# FR-P-05: Direct-to-bank fund disbursement
@partner_bp.route('/campaigns/<campaign_id>/request-disbursement', methods=['POST'])
@jwt_required()
@role_required('partner')
def request_disbursement(campaign_id):
    """Request fund disbursement to bank account"""
    try:
        partner_id = get_jwt_identity()
        partner = Partner.query.get(partner_id)
        
        campaign = Campaign.query.get(campaign_id)
        if not campaign or campaign.partner_id != partner_id:
            return error_response('Campaign not found or unauthorized', 404)
        
        data = request.get_json()
        
        if not data.get('amount'):
            return error_response('Amount required', 400)
        
        amount = float(data['amount'])
        
        if amount <= 0 or amount > campaign.funds_raised:
            return error_response('Invalid amount', 400)
        
        # Create disbursement request
        disbursement = Disbursement(
            campaign_id=campaign.id,
            amount=amount,
            bank_account_number=data.get('bank_account_number', partner.bank_account_number),
            bank_name=data.get('bank_name', partner.bank_name),
            status='pending'
        )
        
        db.session.add(disbursement)
        db.session.commit()
        
        return success_response(
            data=disbursement.to_dict(),
            message='Disbursement request created. Pending admin approval.',
            status_code=201
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@partner_bp.route('/campaigns', methods=['GET'])
@jwt_required()
@role_required('partner')
def get_partner_campaigns():
    """Get all campaigns for the partner"""
    try:
        partner_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        campaigns = Campaign.query.filter_by(partner_id=partner_id).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        items = [campaign.to_dict() for campaign in campaigns.items]
        
        return paginated_response(
            items=items,
            total=campaigns.total,
            page=page,
            per_page=per_page,
            message='Partner campaigns retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


@partner_bp.route('/profile', methods=['GET'])
@jwt_required()
@role_required('partner')
def get_partner_profile():
    """Get partner profile"""
    try:
        partner_id = get_jwt_identity()
        partner = Partner.query.get(partner_id)
        
        if not partner:
            return error_response('Partner not found', 404)
        
        profile_data = partner.to_dict()
        profile_data.update({
            'organization_name': partner.organization_name,
            'organization_type': partner.organization_type,
            'registration_number': partner.registration_number,
            'address': partner.address,
            'city': partner.city,
            'country': partner.country,
            'is_verified': partner.is_verified,
            'bank_account_number': partner.bank_account_number,
            'bank_name': partner.bank_name
        })
        
        return success_response(data=profile_data)
    except Exception as e:
        return error_response(str(e), 500)


@partner_bp.route('/profile', methods=['PUT'])
@jwt_required()
@role_required('partner')
def update_partner_profile():
    """Update partner profile"""
    try:
        partner_id = get_jwt_identity()
        partner = Partner.query.get(partner_id)
        
        if not partner:
            return error_response('Partner not found', 404)
        
        data = request.get_json()
        
        # Update fields
        updatable_fields = ['organization_name', 'address', 'city', 'country', 
                           'bank_account_number', 'bank_name', 'phone', 'first_name', 'last_name']
        
        for field in updatable_fields:
            if field in data:
                setattr(partner, field, data[field])
        
        db.session.commit()
        
        return success_response(data=partner.to_dict(), message='Profile updated successfully')
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)
