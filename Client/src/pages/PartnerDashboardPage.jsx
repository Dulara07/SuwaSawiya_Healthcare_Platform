import React, { useEffect, useState } from 'react';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DollarSign, Users, FileText, Target, AlertCircle, RefreshCcw, UserPlus } from 'lucide-react';
import { createPartnerBeneficiary, fetchPartnerDashboard } from '../api';

export function PartnerDashboardPage() {
  const requiredDocuments = [
    { key: 'medical_certificate', label: 'Medical Certificate' },
    { key: 'verification_document', label: 'Verification Document' },
    { key: 'identity_proof', label: 'Identity Proof' },
    { key: 'bank_verification', label: 'Bank Verification' },
  ];
  const [campaigns, setCampaigns] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [beneficiaryForm, setBeneficiaryForm] = useState({
    beneficiary_name: '',
    beneficiary_age: '',
    beneficiary_medical_condition: '',
    category: '',
    medical_urgency: 3,
    time_sensitivity: 3,
    target_amount: '',
    description: '',
    documents: {
      medical_certificate: null,
      verification_document: null,
      identity_proof: null,
      bank_verification: null,
    },
  });
  const [beneficiarySubmitting, setBeneficiarySubmitting] = useState(false);
  const [beneficiaryError, setBeneficiaryError] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPartnerDashboard();
      setCampaigns(data.campaigns || []);
      setSummary(data.summary || {});
    } catch (err) {
      setError('Failed to load partner dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleBeneficiaryChange = e => {
    const { name, value, files } = e.target;
    if (name.startsWith('document_')) {
      const documentKey = name.replace('document_', '');
      setBeneficiaryForm(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentKey]: files?.[0] || null,
        },
      }));
      return;
    }
    setBeneficiaryForm(prev => ({ ...prev, [name]: value }));
  };

  const submitBeneficiaryRegistration = async e => {
    e.preventDefault();
    setBeneficiarySubmitting(true);
    setBeneficiaryError(null);
    setSuccessMessage(null);
    try {
      const selectedDocuments = Object.values(beneficiaryForm.documents || {}).filter(Boolean);
      if (selectedDocuments.length < requiredDocuments.length) {
        throw new Error('Upload all four required supporting documents before submitting registration');
      }
      await createPartnerBeneficiary({
        ...beneficiaryForm,
        files: selectedDocuments,
      });
      setBeneficiaryForm({
        beneficiary_name: '',
        beneficiary_age: '',
        beneficiary_medical_condition: '',
        category: '',
        medical_urgency: 3,
        time_sensitivity: 3,
        target_amount: '',
        description: '',
        documents: {
          medical_certificate: null,
          verification_document: null,
          identity_proof: null,
          bank_verification: null,
        },
      });
      setSuccessMessage('Beneficiary registered successfully.');
      await loadDashboard();
    } catch (err) {
      setBeneficiaryError(err.message || 'Failed to register beneficiary');
    } finally {
      setBeneficiarySubmitting(false);
    }
  };

  const totalRaised = summary.total_raised ?? campaigns.reduce((acc, curr) => acc + Number(curr.raised_amount ?? curr.raisedAmount ?? 0), 0);
  const totalTarget = summary.total_target ?? campaigns.reduce((acc, curr) => acc + Number(curr.target_amount ?? curr.goalAmount ?? 0), 0);
  const pendingReview = summary.pending_review ?? campaigns.filter(campaign => String(campaign.status || '').toLowerCase() === 'pending').length;
  const approvedCount = summary.approved_campaigns ?? campaigns.filter(campaign => String(campaign.status || '').toLowerCase() === 'approved').length;
  const completedCount = summary.completed_campaigns ?? campaigns.filter(campaign => String(campaign.status || '').toLowerCase() === 'completed').length;
  const completionRate = totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0;

  return <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold">Partner overview</p>
            <h1 className="text-2xl font-bold text-gray-900">Campaign Dashboard</h1>
          </div>
          <Button variant="outline" className="flex items-center" onClick={loadDashboard}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
        {successMessage && <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 flex items-center gap-2"><RefreshCcw className="w-4 h-4" />{successMessage}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Raised</h3>
              <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">LKR {Number(totalRaised).toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">Of LKR {Number(totalTarget).toLocaleString()} total target</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">All Campaigns</h3>
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><FileText className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            <p className="text-sm text-gray-500 mt-2">{approvedCount} approved, {pendingReview} pending</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Target className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            <p className="text-sm text-gray-500 mt-2">{completedCount} completed campaigns</p>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><UserPlus className="w-5 h-5" /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Register Beneficiary</h2>
              <p className="text-sm text-gray-500">Create a campaign and attach all required supporting documents in one step.</p>
            </div>
          </div>

          {beneficiaryError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">{beneficiaryError}</div>}

          <form onSubmit={submitBeneficiaryRegistration} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Name</label>
                <input name="beneficiary_name" value={beneficiaryForm.beneficiary_name} onChange={handleBeneficiaryChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Patient full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Age</label>
                <input name="beneficiary_age" type="number" value={beneficiaryForm.beneficiary_age} onChange={handleBeneficiaryChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="32" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Condition</label>
              <textarea name="beneficiary_medical_condition" value={beneficiaryForm.beneficiary_medical_condition} onChange={handleBeneficiaryChange} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Describe the medical condition and support needed" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input name="category" value={beneficiaryForm.category} onChange={handleBeneficiaryChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Surgery, Cancer Treatment, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (LKR)</label>
                <input name="target_amount" type="number" value={beneficiaryForm.target_amount} onChange={handleBeneficiaryChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="500000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Urgency</label>
                <select name="medical_urgency" value={beneficiaryForm.medical_urgency} onChange={handleBeneficiaryChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value={1}>Low</option>
                  <option value={2}>Moderate</option>
                  <option value={3}>High</option>
                  <option value={4}>Very High</option>
                  <option value={5}>Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Sensitivity</label>
                <select name="time_sensitivity" value={beneficiaryForm.time_sensitivity} onChange={handleBeneficiaryChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value={1}>Low</option>
                  <option value={2}>Moderate</option>
                  <option value={3}>High</option>
                  <option value={4}>Very High</option>
                  <option value={5}>Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Description</label>
              <textarea name="description" value={beneficiaryForm.description} onChange={handleBeneficiaryChange} rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Optional campaign description for the beneficiary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents *</label>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                {requiredDocuments.map(doc => (
                  <div key={doc.key}>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">{doc.label}</label>
                    <input name={`document_${doc.key}`} type="file" onChange={handleBeneficiaryChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">All four documents are required before the registration can be submitted.</p>
            </div>

            <Button type="submit" isLoading={beneficiarySubmitting} disabled={beneficiarySubmitting} className="w-full inline-flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" /> Register Beneficiary
            </Button>
          </form>
        </section>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">All Campaign Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Beneficiary</th>
                  <th className="px-6 py-3">Condition</th>
                  <th className="px-6 py-3">Owner ID</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Raised</th>
                  <th className="px-6 py-3">Goal</th>
                  <th className="px-6 py-3">Progress</th>
                  <th className="px-6 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map(campaign => <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{campaign.title}</td>
                    <td className="px-6 py-4 text-gray-600">{campaign.beneficiary_name || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{campaign.beneficiary_medical_condition || campaign.description || '-'}</td>
                    <td className="px-6 py-4 text-gray-500">{campaign.owner_id ?? '-'}</td>
                    <td className="px-6 py-4"><StatusBadge status={campaign.status} /></td>
                    <td className="px-6 py-4 text-green-600 font-medium">LKR {Number(campaign.raised_amount ?? campaign.raisedAmount ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">LKR {Number(campaign.target_amount ?? campaign.goalAmount ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{Number(campaign.progress_percentage ?? 0).toFixed(0)}%</td>
                    <td className="px-6 py-4 text-gray-500">{campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : '-'}</td>
                  </tr>)}
                {!loading && campaigns.length === 0 && <tr><td className="px-6 py-6 text-gray-500" colSpan={8}>No campaigns found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
}
