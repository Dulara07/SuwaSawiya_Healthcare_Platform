// API utility for the frontend to connect to the backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function register(data) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Full error response:', JSON.stringify(errorData, null, 2));
    
    let errorMessage = 'Registration failed';
    
    // Handle validation errors (422)
    if (Array.isArray(errorData.detail)) {
      console.log('Error detail array:', errorData.detail);
      const errors = errorData.detail.map(err => {
        console.log('Processing error item:', err);
        // New format: {field, message, type}
        if (err.field && err.message) {
          return `${err.field}: ${err.message}`;
        }
        // Old format: {loc, msg, type}
        if (err.loc) {
          const field = err.loc.join('.');
          return `${field}: ${err.msg}`;
        }
        // Fallback
        return JSON.stringify(err);
      }).join('\n');
      errorMessage = errors || 'Validation error';
      console.log('Formatted error message:', errorMessage);
    } else if (typeof errorData.detail === 'string') {
      errorMessage = errorData.detail;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }
    
    throw new Error(errorMessage);
  }
  return response.json();
}
export async function login(username, password, role = 'donor') {
  const loginPath = role === 'admin' ? '/auth/login/admin' : role === 'partner' ? '/auth/login/partner' : '/auth/login/donor';
  const response = await fetch(`${API_BASE_URL}${loginPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed');
  }
  const data = await response.json();
  return data.access_token;
}

export async function fetchCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch current user');
  return response.json();
}

export async function createDonation({ amount, campaignId, isAnonymous = false }) {
  const response = await fetch(`${API_BASE_URL}/donations/`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Number(amount),
      campaign_id: campaignId,
      is_anonymous: isAnonymous,
    }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Please log in before donating');
    }
    throw new Error('Failed to create donation');
  }
  return response.json();
}

function normalizeCampaign(campaign) {
  const targetAmount = campaign.goalAmount ?? campaign.target_amount ?? 0;
  const raisedAmount = campaign.raisedAmount ?? campaign.raised_amount ?? 0;
  const medicalUrgency = campaign.medical_urgency ?? campaign.urgencyLevel ?? 3;
  const timeSensitivity = campaign.time_sensitivity ?? campaign.timeSensitivity ?? 3;
  const urgencyMap = {
    5: 'Critical',
    4: 'High',
    3: 'Medium',
    2: 'Low',
    1: 'Low',
  };

  return {
    ...campaign,
    goalAmount: targetAmount,
    raisedAmount,
    currency: campaign.currency || 'LKR',
    imageUrl:
      campaign.imageUrl ||
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000',
    deadline: campaign.deadline || campaign.created_at || campaign.createdAt || new Date().toISOString(),
    category: campaign.category || campaign.title?.split(' for ')[0] || 'Medical Support',
    urgency: campaign.urgency || urgencyMap[medicalUrgency] || 'Medium',
    verified: campaign.verified ?? true,
    patientName: campaign.patientName || campaign.title,
    createdAt: campaign.createdAt || campaign.created_at,
    updatedAt: campaign.updatedAt || campaign.updated_at,
    priorityScore: campaign.priorityScore ?? campaign.priority_score ?? 0,
    status: campaign.status || 'Active',
    beneficiary_name: campaign.beneficiary_name || campaign.patientName || campaign.title,
    beneficiary_age: campaign.beneficiary_age ?? null,
    beneficiary_medical_condition: campaign.beneficiary_medical_condition || campaign.description,
    goal_amount: campaign.goal_amount ?? targetAmount,
    raised_amount: campaign.raised_amount ?? raisedAmount,
    medical_urgency: medicalUrgency,
    time_sensitivity: timeSensitivity,
    target_amount: targetAmount,
    updates: Array.isArray(campaign.updates) ? campaign.updates : [],
  };
}

function normalizeCampaignList(payload) {
  if (!Array.isArray(payload)) return [];
  return payload.map(normalizeCampaign);
}

export async function fetchCampaigns() {
  const response = await fetch(`${API_BASE_URL}/campaigns/`);
  if (!response.ok) throw new Error('Failed to fetch campaigns');
  const data = await response.json();
  return normalizeCampaignList(data);
}

export async function fetchPartnerDashboard() {
  const response = await fetch(`${API_BASE_URL}/campaigns/partner/dashboard`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch partner dashboard');
  const data = await response.json();
  return {
    summary: data.summary || {},
    campaigns: normalizeCampaignList(data.campaigns || []),
  };
}

export async function createPartnerBeneficiary(data) {
  const formData = new FormData();
  formData.append('beneficiary_name', data.beneficiary_name);
  if (data.beneficiary_age !== '' && data.beneficiary_age !== null && data.beneficiary_age !== undefined) {
    formData.append('beneficiary_age', data.beneficiary_age);
  }
  formData.append('beneficiary_medical_condition', data.beneficiary_medical_condition);
  if (data.category) formData.append('category', data.category);
  formData.append('medical_urgency', data.medical_urgency);
  formData.append('time_sensitivity', data.time_sensitivity);
  formData.append('target_amount', data.target_amount);
  if (data.description) formData.append('description', data.description);
  (data.files || []).forEach(file => formData.append('files', file));

  const response = await fetch(`${API_BASE_URL}/campaigns/partner/register-beneficiary`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to register beneficiary');
  return normalizeCampaign(await response.json());
}

export async function uploadPartnerCampaignDocument({ campaignId, documentFile, documentType }) {
  const formData = new FormData();
  formData.append('document', documentFile);
  formData.append('document_type', documentType);

  const response = await fetch(`${API_BASE_URL}/campaigns/partner/campaigns/${campaignId}/documents`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload document');
  return response.json();
}


export async function createCampaign(data) {
  // Backend expects multipart/form-data
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('medical_urgency', data.medical_urgency);
  formData.append('time_sensitivity', data.time_sensitivity);
  formData.append('target_amount', data.target_amount);
  // Add files if needed: formData.append('files', file)

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/campaigns/`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: token ? { 'Authorization': 'Bearer ' + token } : {},
  });
  if (!response.ok) throw new Error('Failed to create campaign');
  return normalizeCampaign(await response.json());
}

export async function fetchAdminDashboard() {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch admin dashboard');
  return response.json();
}

export async function fetchPendingAdminCampaigns() {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns/pending`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch pending campaigns');
  return normalizeCampaignList(await response.json());
}

export async function fetchAllAdminCampaigns() {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch campaigns');
  return normalizeCampaignList(await response.json());
}

export async function fetchAdminCampaign(campaignId) {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch campaign');
  return response.json();
}

export async function approveCampaign(campaignId) {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to approve campaign');
  return response.json();
}

export async function rejectCampaign(campaignId) {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to reject campaign');
  return response.json();
}

export async function fetchPendingPatients() {
  const response = await fetch(`${API_BASE_URL}/admin/patients/pending`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch pending patients');
  return response.json();
}

export async function fetchAllPatients() {
  const response = await fetch(`${API_BASE_URL}/admin/patients`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch patients');
  return response.json();
}

export async function approvePatient(userId) {
  const response = await fetch(`${API_BASE_URL}/admin/patients/${userId}/approve`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to approve patient');
  return response.json();
}

export async function rejectPatient(userId) {
  const response = await fetch(`${API_BASE_URL}/admin/patients/${userId}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to reject patient');
  return response.json();
}

export async function fetchFraudReports() {
  const response = await fetch(`${API_BASE_URL}/admin/fraud-reports`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch fraud reports');
  return response.json();
}

export async function reviewFraudReport(reportId) {
  const response = await fetch(`${API_BASE_URL}/admin/fraud-reports/${reportId}/review`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to review fraud report');
  return response.json();
}

export async function resolveFraudReport(reportId) {
  const response = await fetch(`${API_BASE_URL}/admin/fraud-reports/${reportId}/resolve`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to resolve fraud report');
  return response.json();
}

export async function adminUpdateCampaign(campaignId, data) {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update campaign');
  return normalizeCampaign(await response.json());
}

export async function adminDeleteCampaign(campaignId) {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete campaign');
  return response.json();
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: 'Bearer ' + token } : {};
}
