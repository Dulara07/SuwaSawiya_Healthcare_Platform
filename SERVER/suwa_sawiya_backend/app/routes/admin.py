"""Admin routes - FR-A-01 to FR-A-05"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models import db
from app.models.user import User, Admin, Partner, Donor
from app.models.campaign import Campaign, Donation
from app.models.other import Document, Disbursement, FraudReport
from app.utils.response import success_response, error_response, paginated_response
from app.utils.auth import role_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


# FR-A-01: Admin dashboard
@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@role_required('admin')
def admin_dashboard():
    """Get admin dashboard statistics"""
    try:
        # Get statistics
        total_users = User.query.count()
        total_donors = Donor.query.count()
        total_partners = Partner.query.count()
        total_campaigns = Campaign.query.count()
        approved_campaigns = Campaign.query.filter_by(status='approved').count()
        pending_campaigns = Campaign.query.filter_by(status='pending').count()
        
        total_funds_raised = db.session.query(db.func.sum(Campaign.funds_raised)).scalar() or 0
        total_donations = Donation.query.filter_by(status='completed').count()
        
        # Get recent campaigns
        recent_campaigns = Campaign.query.order_by(Campaign.created_at.desc()).limit(5).all()
        
        # Get pending fraud reports
        pending_fraud_reports = FraudReport.query.filter_by(status='pending').count()
        
        # Get pending disbursement requests
        pending_disbursements = Disbursement.query.filter_by(status='pending').count()
        
        return success_response(
            data={
                'users': {
                    'total': total_users,
                    'donors': total_donors,
                    'partners': total_partners
                },
                'campaigns': {
                    'total': total_campaigns,
                    'approved': approved_campaigns,
                    'pending': pending_campaigns,
                    'total_funds_raised': total_funds_raised
                },
                'donations': {
                    'total': total_donations,
                    'average_amount': total_funds_raised / total_donations if total_donations > 0 else 0
                },
                'pending_items': {
                    'fraud_reports': pending_fraud_reports,
                    'disbursement_requests': pending_disbursements
                },
                'recent_campaigns': [c.to_dict() for c in recent_campaigns]
            },
            message='Dashboard data retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


# FR-A-02: Review and verify campaigns
@admin_bp.route('/campaigns/pending', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_pending_campaigns():
    """Get pending campaigns for review"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        campaigns = Campaign.query.filter_by(status='pending').paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        items = [campaign.to_dict() for campaign in campaigns.items]
        
        return paginated_response(
            items=items,
            total=campaigns.total,
            page=page,
            per_page=per_page,
            message='Pending campaigns retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


@admin_bp.route('/campaigns/<campaign_id>/approve', methods=['POST'])
@jwt_required()
@role_required('admin')
def approve_campaign(campaign_id):
    """Approve a campaign"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return error_response('Campaign not found', 404)
        
        data = request.get_json()
        
        campaign.status = 'approved'
        campaign.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return success_response(
            data=campaign.to_dict(),
            message='Campaign approved successfully'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@admin_bp.route('/campaigns/<campaign_id>/reject', methods=['POST'])
@jwt_required()
@role_required('admin')
def reject_campaign(campaign_id):
    """Reject a campaign"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return error_response('Campaign not found', 404)
        
        data = request.get_json()
        reason = data.get('reason', 'No reason provided')
        
        campaign.status = 'rejected'
        campaign.updated_at = datetime.utcnow()
        
        # Could add a rejection reason field to Campaign model
        db.session.commit()
        
        return success_response(
            data=campaign.to_dict(),
            message='Campaign rejected successfully'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


# FR-A-03: Approve or reject partner registrations
@admin_bp.route('/partners/pending', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_pending_partners():
    """Get pending partner verifications"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        partners = Partner.query.filter_by(is_verified=False).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        items = []
        for partner in partners.items:
            data = partner.to_dict()
            data.update({
                'organization_name': partner.organization_name,
                'organization_type': partner.organization_type,
                'registration_number': partner.registration_number
            })
            items.append(data)
        
        return paginated_response(
            items=items,
            total=partners.total,
            page=page,
            per_page=per_page,
            message='Pending partners retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


@admin_bp.route('/partners/<partner_id>/verify', methods=['POST'])
@jwt_required()
@role_required('admin')
def verify_partner(partner_id):
    """Verify a partner organization"""
    try:
        partner = Partner.query.get(partner_id)
        
        if not partner:
            return error_response('Partner not found', 404)
        
        partner.is_verified = True
        partner.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return success_response(
            data=partner.to_dict(),
            message='Partner verified successfully'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@admin_bp.route('/partners/<partner_id>/reject', methods=['POST'])
@jwt_required()
@role_required('admin')
def reject_partner(partner_id):
    """Reject a partner organization"""
    try:
        partner = Partner.query.get(partner_id)
        
        if not partner:
            return error_response('Partner not found', 404)
        
        data = request.get_json()
        reason = data.get('reason', 'No reason provided')
        
        # Deactivate partner
        partner.is_active = False
        partner.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return success_response(
            data=partner.to_dict(),
            message='Partner rejected successfully'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


# FR-A-04: Manage campaigns
@admin_bp.route('/campaigns', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_all_campaigns():
    """Get all campaigns with filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        query = Campaign.query
        
        if status:
            query = query.filter_by(status=status)
        
        campaigns = query.paginate(page=page, per_page=per_page, error_out=False)
        
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


@admin_bp.route('/campaigns/<campaign_id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_campaign(campaign_id):
    """Update campaign details"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return error_response('Campaign not found', 404)
        
        data = request.get_json()
        
        # Update allowed fields
        updatable_fields = ['title', 'description', 'category', 'urgency', 'target_amount']
        
        for field in updatable_fields:
            if field in data:
                if field == 'target_amount':
                    setattr(campaign, field, float(data[field]))
                else:
                    setattr(campaign, field, data[field])
        
        campaign.updated_at = datetime.utcnow()
        db.session.commit()
        
        return success_response(
            data=campaign.to_dict(),
            message='Campaign updated successfully'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@admin_bp.route('/campaigns/<campaign_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_campaign(campaign_id):
    """Delete a campaign"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return error_response('Campaign not found', 404)
        
        db.session.delete(campaign)
        db.session.commit()
        
        return success_response(message='Campaign deleted successfully')
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


# FR-A-05: Fraud reporting and management
@admin_bp.route('/fraud-reports', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_fraud_reports():
    """Get fraud reports"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        query = FraudReport.query
        
        if status:
            query = query.filter_by(status=status)
        
        reports = query.paginate(page=page, per_page=per_page, error_out=False)
        
        items = [report.to_dict() for report in reports.items]
        
        return paginated_response(
            items=items,
            total=reports.total,
            page=page,
            per_page=per_page,
            message='Fraud reports retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


@admin_bp.route('/fraud-reports/<report_id>/investigate', methods=['POST'])
@jwt_required()
@role_required('admin')
def investigate_fraud_report(report_id):
    """Start investigating a fraud report"""
    try:
        report = FraudReport.query.get(report_id)
        
        if not report:
            return error_response('Report not found', 404)
        
        report.status = 'investigating'
        report.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return success_response(
            data=report.to_dict(),
            message='Investigation started'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@admin_bp.route('/fraud-reports/<report_id>/confirm', methods=['POST'])
@jwt_required()
@role_required('admin')
def confirm_fraud(report_id):
    """Confirm fraud - suspend campaign"""
    try:
        report = FraudReport.query.get(report_id)
        
        if not report:
            return error_response('Report not found', 404)
        
        data = request.get_json()
        
        report.status = 'confirmed'
        report.investigation_notes = data.get('investigation_notes')
        report.updated_at = datetime.utcnow()
        
        # Suspend the campaign
        campaign = Campaign.query.get(report.campaign_id)
        campaign.status = 'cancelled'
        campaign.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return success_response(
            data=report.to_dict(),
            message='Fraud confirmed. Campaign suspended.'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@admin_bp.route('/fraud-reports/<report_id>/dismiss', methods=['POST'])
@jwt_required()
@role_required('admin')
def dismiss_fraud_report(report_id):
    """Dismiss a fraud report"""
    try:
        report = FraudReport.query.get(report_id)
        
        if not report:
            return error_response('Report not found', 404)
        
        data = request.get_json()
        
        report.status = 'dismissed'
        report.investigation_notes = data.get('investigation_notes')
        report.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return success_response(
            data=report.to_dict(),
            message='Fraud report dismissed'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


# Manage disbursement requests
@admin_bp.route('/disbursements', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_disbursement_requests():
    """Get pending disbursement requests"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        query = Disbursement.query
        
        if status:
            query = query.filter_by(status=status)
        
        disbursements = query.paginate(page=page, per_page=per_page, error_out=False)
        
        items = [d.to_dict() for d in disbursements.items]
        
        return paginated_response(
            items=items,
            total=disbursements.total,
            page=page,
            per_page=per_page,
            message='Disbursement requests retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)


@admin_bp.route('/disbursements/<disbursement_id>/approve', methods=['POST'])
@jwt_required()
@role_required('admin')
def approve_disbursement(disbursement_id):
    """Approve a disbursement request"""
    try:
        admin_id = get_jwt_identity()
        disbursement = Disbursement.query.get(disbursement_id)
        
        if not disbursement:
            return error_response('Disbursement not found', 404)
        
        data = request.get_json()
        
        disbursement.status = 'approved'
        disbursement.approved_by_id = admin_id
        disbursement.approval_notes = data.get('approval_notes')
        disbursement.approved_at = datetime.utcnow()
        
        db.session.commit()
        
        return success_response(
            data=disbursement.to_dict(),
            message='Disbursement approved'
        )
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), 500)


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_all_users():
    """Get all users"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        user_type = request.args.get('user_type')
        
        query = User.query
        
        if user_type:
            query = query.filter_by(user_type=user_type)
        
        users = query.paginate(page=page, per_page=per_page, error_out=False)
        
        items = [user.to_dict() for user in users.items]
        
        return paginated_response(
            items=items,
            total=users.total,
            page=page,
            per_page=per_page,
            message='Users retrieved successfully'
        )
    except Exception as e:
        return error_response(str(e), 500)
