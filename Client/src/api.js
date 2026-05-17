export async function register(data) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}
export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  return data.access_token;
}
// API utility for the frontend to connect to the backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
    goal_amount: campaign.goal_amount ?? targetAmount,
    raised_amount: campaign.raised_amount ?? raisedAmount,
    medical_urgency: medicalUrgency,
    time_sensitivity: timeSensitivity,
    target_amount: targetAmount,
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

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: 'Bearer ' + token } : {};
}
