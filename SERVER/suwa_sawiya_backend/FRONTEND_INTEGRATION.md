"""Frontend API Integration Example

This file demonstrates how to integrate the SuwaSawiya backend API
with the React frontend application.
"""

# Configuration
API_BASE_URL = 'http://localhost:5000/api'
STRIPE_PUBLIC_KEY = 'pk_test_your_stripe_key'  # From .env

# API Service Classes
class AuthService:
    """Authentication service"""
    
    @staticmethod
    def register_donor(email, password, first_name, last_name=None, phone=None):
        """Register new donor"""
        return {
            'endpoint': f'{API_BASE_URL}/auth/register/donor',
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': {
                'email': email,
                'password': password,
                'first_name': first_name,
                'last_name': last_name,
                'phone': phone
            }
        }
    
    @staticmethod
    def register_partner(email, password, first_name, organization_name, organization_type, **kwargs):
        """Register new partner organization"""
        return {
            'endpoint': f'{API_BASE_URL}/auth/register/partner',
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': {
                'email': email,
                'password': password,
                'first_name': first_name,
                'organization_name': organization_name,
                'organization_type': organization_type,
                **kwargs
            }
        }
    
    @staticmethod
    def login(email, password):
        """Login user"""
        return {
            'endpoint': f'{API_BASE_URL}/auth/login',
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': {
                'email': email,
                'password': password
            }
        }


class DonorService:
    """Donor operations service"""
    
    @staticmethod
    def get_campaigns(page=1, per_page=10):
        """Browse all campaigns"""
        return {
            'endpoint': f'{API_BASE_URL}/donor/campaigns?page={page}&per_page={per_page}',
            'method': 'GET'
        }
    
    @staticmethod
    def search_campaigns(search=None, category=None, urgency=None, page=1, per_page=10):
        """Search and filter campaigns"""
        params = f'page={page}&per_page={per_page}'
        if search:
            params += f'&search={search}'
        if category:
            params += f'&category={category}'
        if urgency:
            params += f'&urgency={urgency}'
        
        return {
            'endpoint': f'{API_BASE_URL}/donor/campaigns/search?{params}',
            'method': 'GET'
        }
    
    @staticmethod
    def get_priority_campaigns():
        """Get priority campaigns by urgency"""
        return {
            'endpoint': f'{API_BASE_URL}/donor/campaigns/priority',
            'method': 'GET'
        }
    
    @staticmethod
    def get_campaign_details(campaign_id):
        """Get detailed campaign information"""
        return {
            'endpoint': f'{API_BASE_URL}/donor/campaigns/{campaign_id}',
            'method': 'GET'
        }
    
    @staticmethod
    def make_donation(campaign_id, amount, is_anonymous=False, message=None, token=None):
        """Make a donation"""
        return {
            'endpoint': f'{API_BASE_URL}/donor/donate',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            },
            'body': {
                'campaign_id': campaign_id,
                'amount': amount,
                'is_anonymous': is_anonymous,
                'message': message
            }
        }
    
    @staticmethod
    def confirm_donation(donation_id, token=None):
        """Confirm donation after payment"""
        return {
            'endpoint': f'{API_BASE_URL}/donor/donations/{donation_id}/confirm',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            }
        }
    
    @staticmethod
    def get_donation_history(token=None, page=1, per_page=10):
        """Get donor's donation history"""
        return {
            'endpoint': f'{API_BASE_URL}/donor/donations?page={page}&per_page={per_page}',
            'method': 'GET',
            'headers': {'Authorization': f'Bearer {token}'}
        }
    
    @staticmethod
    def get_campaign_updates(campaign_id):
        """Get campaign progress updates"""
        return {
            'endpoint': f'{API_BASE_URL}/donor/campaigns/{campaign_id}/updates',
            'method': 'GET'
        }


class PartnerService:
    """Partner operations service"""
    
    @staticmethod
    def create_campaign(title, category, urgency, target_amount, beneficiary_name, 
                       beneficiary_medical_condition, token=None, description=None, 
                       beneficiary_age=None, cover_image=None, medical_document=None):
        """Create a new campaign"""
        return {
            'endpoint': f'{API_BASE_URL}/partner/campaigns',
            'method': 'POST',
            'headers': {'Authorization': f'Bearer {token}'},
            'multipart': True,  # For file upload
            'body': {
                'title': title,
                'category': category,
                'urgency': urgency,
                'target_amount': target_amount,
                'beneficiary_name': beneficiary_name,
                'beneficiary_medical_condition': beneficiary_medical_condition,
                'description': description,
                'beneficiary_age': beneficiary_age,
                'cover_image': cover_image,
                'medical_document': medical_document
            }
        }
    
    @staticmethod
    def upload_document(campaign_id, document_file, document_type, token=None):
        """Upload medical or verification document"""
        return {
            'endpoint': f'{API_BASE_URL}/partner/campaigns/{campaign_id}/documents',
            'method': 'POST',
            'headers': {'Authorization': f'Bearer {token}'},
            'multipart': True,
            'body': {
                'document': document_file,
                'document_type': document_type
            }
        }
    
    @staticmethod
    def get_campaign_progress(campaign_id, token=None):
        """Get campaign progress and statistics"""
        return {
            'endpoint': f'{API_BASE_URL}/partner/campaigns/{campaign_id}/progress',
            'method': 'GET',
            'headers': {'Authorization': f'Bearer {token}'}
        }
    
    @staticmethod
    def request_disbursement(campaign_id, amount, token=None, bank_account_number=None, bank_name=None):
        """Request fund disbursement"""
        return {
            'endpoint': f'{API_BASE_URL}/partner/campaigns/{campaign_id}/request-disbursement',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            },
            'body': {
                'amount': amount,
                'bank_account_number': bank_account_number,
                'bank_name': bank_name
            }
        }
    
    @staticmethod
    def get_partner_campaigns(token=None, page=1, per_page=10):
        """Get all campaigns for the partner"""
        return {
            'endpoint': f'{API_BASE_URL}/partner/campaigns?page={page}&per_page={per_page}',
            'method': 'GET',
            'headers': {'Authorization': f'Bearer {token}'}
        }


class AdminService:
    """Admin operations service"""
    
    @staticmethod
    def get_dashboard(token=None):
        """Get admin dashboard statistics"""
        return {
            'endpoint': f'{API_BASE_URL}/admin/dashboard',
            'method': 'GET',
            'headers': {'Authorization': f'Bearer {token}'}
        }
    
    @staticmethod
    def get_pending_campaigns(token=None, page=1, per_page=10):
        """Get pending campaigns for review"""
        return {
            'endpoint': f'{API_BASE_URL}/admin/campaigns/pending?page={page}&per_page={per_page}',
            'method': 'GET',
            'headers': {'Authorization': f'Bearer {token}'}
        }
    
    @staticmethod
    def approve_campaign(campaign_id, token=None):
        """Approve a campaign"""
        return {
            'endpoint': f'{API_BASE_URL}/admin/campaigns/{campaign_id}/approve',
            'method': 'POST',
            'headers': {'Authorization': f'Bearer {token}'}
        }
    
    @staticmethod
    def reject_campaign(campaign_id, reason=None, token=None):
        """Reject a campaign"""
        return {
            'endpoint': f'{API_BASE_URL}/admin/campaigns/{campaign_id}/reject',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            },
            'body': {'reason': reason}
        }
    
    @staticmethod
    def get_fraud_reports(token=None, status=None, page=1, per_page=10):
        """Get fraud reports"""
        params = f'page={page}&per_page={per_page}'
        if status:
            params += f'&status={status}'
        
        return {
            'endpoint': f'{API_BASE_URL}/admin/fraud-reports?{params}',
            'method': 'GET',
            'headers': {'Authorization': f'Bearer {token}'}
        }
    
    @staticmethod
    def get_disbursement_requests(token=None, status=None, page=1, per_page=10):
        """Get disbursement requests"""
        params = f'page={page}&per_page={per_page}'
        if status:
            params += f'&status={status}'
        
        return {
            'endpoint': f'{API_BASE_URL}/admin/disbursements?{params}',
            'method': 'GET',
            'headers': {'Authorization': f'Bearer {token}'}
        }
    
    @staticmethod
    def approve_disbursement(disbursement_id, approval_notes=None, token=None):
        """Approve disbursement request"""
        return {
            'endpoint': f'{API_BASE_URL}/admin/disbursements/{disbursement_id}/approve',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            },
            'body': {'approval_notes': approval_notes}
        }


# Example Usage in React

"""
import React, { useState } from 'react'

function DonorCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  
  async function fetchCampaigns() {
    const config = DonorService.get_campaigns()
    const response = await fetch(config.endpoint, {
      method: config.method
    })
    const data = await response.json()
    setCampaigns(data.data)
  }
  
  async function handleDonate(campaignId, amount) {
    const token = localStorage.getItem('auth_token')
    const config = DonorService.make_donation(campaignId, amount, false, null, token)
    
    const response = await fetch(config.endpoint, {
      method: config.method,
      headers: config.headers,
      body: JSON.stringify(config.body)
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Initialize Stripe payment
      const stripe = window.Stripe(STRIPE_PUBLIC_KEY)
      await stripe.confirmCardPayment(data.data.client_secret, {
        payment_method: {
          card: cardElement
        }
      })
    }
  }
  
  return (
    <div>
      {campaigns.map(campaign => (
        <div key={campaign.id}>
          <h3>{campaign.title}</h3>
          <p>Raised: ${campaign.funds_raised} / ${campaign.target_amount}</p>
          <button onClick={() => handleDonate(campaign.id, 100)}>
            Donate $100
          </button>
        </div>
      ))}
    </div>
  )
}
"""
