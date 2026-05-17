import React, { useEffect, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  fetchAdminDashboard,
  fetchPendingAdminCampaigns,
  fetchAllAdminCampaigns,
  approveCampaign,
  rejectCampaign,
  fetchPendingPatients,
  fetchAllPatients,
  approvePatient,
  rejectPatient,
  fetchFraudReports,
  reviewFraudReport,
  resolveFraudReport,
} from '../api';
import { ShieldCheck, Users, Megaphone, FlagTriangleRight, RefreshCw, CheckCircle2, XCircle, Eye } from 'lucide-react';

function statusVariant(status) {
  const value = String(status || '').toLowerCase();
  if (value === 'approved' || value === 'reviewed' || value === 'resolved') return 'success';
  if (value === 'pending') return 'warning';
  if (value === 'rejected') return 'danger';
  return 'neutral';
}

export function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [pendingPatients, setPendingPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [fraudReports, setFraudReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboard, campaignsPending, campaignsAll, patientsPending, patientsAll, reports] = await Promise.all([
        fetchAdminDashboard(),
        fetchPendingAdminCampaigns(),
        fetchAllAdminCampaigns(),
        fetchPendingPatients(),
        fetchAllPatients(),
        fetchFraudReports(),
      ]);
      setSummary(dashboard);
      setPendingCampaigns(campaignsPending);
      setAllCampaigns(campaignsAll);
      setPendingPatients(patientsPending);
      setAllPatients(patientsAll);
      setFraudReports(reports);
    } catch (err) {
      setError('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refresh = async () => {
    await loadData();
  };

  const handleCampaignAction = async (campaignId, action) => {
    if (action === 'approve') {
      await approveCampaign(campaignId);
    } else {
      await rejectCampaign(campaignId);
    }
    await refresh();
  };

  const handlePatientAction = async (userId, action) => {
    if (action === 'approve') {
      await approvePatient(userId);
    } else {
      await rejectPatient(userId);
    }
    await refresh();
  };

  const handleFraudAction = async (reportId, action) => {
    if (action === 'review') {
      await reviewFraudReport(reportId);
    } else {
      await resolveFraudReport(reportId);
    }
    await refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold">Administration</p>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Review campaigns, approve patient registrations, and handle fraud reports.</p>
          </div>
          <Button onClick={refresh} className="inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard icon={ShieldCheck} label="Pending Campaigns" value={summary?.campaigns_pending_review ?? pendingCampaigns.length} />
          <SummaryCard icon={Users} label="Pending Patients" value={summary?.patient_registrations_pending ?? pendingPatients.length} />
          <SummaryCard icon={FlagTriangleRight} label="Fraud Reports" value={summary?.fraud_reports_pending ?? fraudReports.filter(r => r.status === 'pending').length} />
          <SummaryCard icon={Megaphone} label="All Campaigns" value={summary?.total_campaigns ?? allCampaigns.length} />
        </div>

        {loading ? <div className="py-20 text-center text-slate-500">Loading admin data...</div> : (
          <div className="space-y-8">
            <SectionCard title="Campaign Review" subtitle="Approve or reject campaigns waiting for moderation.">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-slate-500 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Campaign</th>
                      <th className="px-4 py-3">Owner</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingCampaigns.map(campaign => (
                      <tr key={campaign.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-slate-900">{campaign.title}</td>
                        <td className="px-4 py-3 text-slate-600">User #{campaign.owner_id || 'N/A'}</td>
                        <td className="px-4 py-3"><Badge variant={statusVariant(campaign.status)}>{campaign.status}</Badge></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => handleCampaignAction(campaign.id, 'approve')} className="inline-flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, 'reject')} className="inline-flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pendingCampaigns.length === 0 && <tr><td className="px-4 py-6 text-slate-500" colSpan={4}>No campaigns awaiting review.</td></tr>}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard title="Patient Registrations" subtitle="Approve or reject patient sign-ups before activation.">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-slate-500 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingPatients.map(patient => (
                      <tr key={patient.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-slate-900">{patient.full_name || patient.username}</td>
                        <td className="px-4 py-3 text-slate-600">{patient.email}</td>
                        <td className="px-4 py-3"><Badge variant={statusVariant(patient.registration_status)}>{patient.registration_status}</Badge></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => handlePatientAction(patient.id, 'approve')} className="inline-flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handlePatientAction(patient.id, 'reject')} className="inline-flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pendingPatients.length === 0 && <tr><td className="px-4 py-6 text-slate-500" colSpan={4}>No patient registrations awaiting approval.</td></tr>}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard title="Fraud Reports" subtitle="Track reports and move them through review states.">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-slate-500 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Campaign ID</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fraudReports.map(report => (
                      <tr key={report.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-slate-900">#{report.campaign_id}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-xl">{report.reason}</td>
                        <td className="px-4 py-3"><Badge variant={statusVariant(report.status)}>{report.status}</Badge></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleFraudAction(report.id, 'review')} className="inline-flex items-center gap-1">
                              <Eye className="w-4 h-4" /> Review
                            </Button>
                            <Button size="sm" onClick={() => handleFraudAction(report.id, 'resolve')} className="inline-flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Resolve
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {fraudReports.length === 0 && <tr><td className="px-4 py-6 text-slate-500" colSpan={4}>No fraud reports yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard title="Campaign Management" subtitle="Review all campaigns and their moderation state.">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-slate-500 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">Campaign</th>
                      <th className="px-4 py-3">Raised</th>
                      <th className="px-4 py-3">Target</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allCampaigns.map(campaign => (
                      <tr key={campaign.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-slate-900">{campaign.title}</td>
                        <td className="px-4 py-3 text-slate-600">{campaign.currency} {Number(campaign.raisedAmount || campaign.raised_amount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-600">{campaign.currency} {Number(campaign.goalAmount || campaign.target_amount || 0).toLocaleString()}</td>
                        <td className="px-4 py-3"><Badge variant={statusVariant(campaign.status)}>{campaign.status}</Badge></td>
                      </tr>
                    ))}
                    {allCampaigns.length === 0 && <tr><td className="px-4 py-6 text-slate-500" colSpan={4}>No campaigns available.</td></tr>}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}