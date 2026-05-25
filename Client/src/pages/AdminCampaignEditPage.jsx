import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { API_BASE_URL, fetchAdminCampaign, adminUpdateCampaign, adminDeleteCampaign, approveCampaign } from '../api';

export function AdminCampaignEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);

  const resolveDocumentUrl = url => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
    const filename = url.split(/[\\/]/).pop();
    return `${API_BASE_URL}/uploads/${filename}`;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const c = await fetchAdminCampaign(id);
        setCampaign(c);
        setForm({
          title: c.title || '',
          description: c.description || '',
          medical_urgency: c.medical_urgency || 3,
          time_sensitivity: c.time_sensitivity || 3,
          target_amount: c.target_amount || c.goalAmount || 0,
          raised_amount: c.raised_amount || c.raisedAmount || 0,
          status: c.status || 'pending',
          priority_score: c.priority_score || c.priorityScore || 0,
        });
      } catch (e) {
        setError(e.message || 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const save = async () => {
    setError(null);
    try {
      setSaving(true);
      await adminUpdateCampaign(id, form);
      navigate('/admin/dashboard');
    } catch (e) {
      setError('Failed to save campaign');
    } finally {
      setSaving(false);
    }
  };

  const approve = async () => {
    setError(null);
    try {
      setApproving(true);
      await approveCampaign(id);
      navigate('/admin/dashboard');
    } catch (e) {
      setError(e.message || 'Failed to approve campaign');
    } finally {
      setApproving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this campaign?')) return;
    try {
      await adminDeleteCampaign(id);
      navigate('/admin/dashboard');
    } catch (e) {
      setError('Failed to delete campaign');
    }
  };

  if (loading) return <div className="p-8">Loading campaign...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Campaign — {campaign.title}</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/dashboard')}>Back</Button>
            <Button variant="destructive" onClick={remove}>Delete</Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <label className="block mb-2">Title</label>
          <input className="w-full p-2 border rounded" value={form.title} onChange={e => handleChange('title', e.target.value)} />

          <label className="block mt-4 mb-2">Description</label>
          <textarea className="w-full p-2 border rounded" rows={6} value={form.description} onChange={e => handleChange('description', e.target.value)} />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-2">Medical Urgency (1-5)</label>
              <input type="number" min={1} max={5} className="w-full p-2 border rounded" value={form.medical_urgency} onChange={e => handleChange('medical_urgency', Number(e.target.value))} />
            </div>
            <div>
              <label className="block mb-2">Time Sensitivity (1-5)</label>
              <input type="number" min={1} max={5} className="w-full p-2 border rounded" value={form.time_sensitivity} onChange={e => handleChange('time_sensitivity', Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-2">Target Amount</label>
              <input type="number" className="w-full p-2 border rounded" value={form.target_amount} onChange={e => handleChange('target_amount', Number(e.target.value))} />
            </div>
            <div>
              <label className="block mb-2">Raised Amount</label>
              <input type="number" className="w-full p-2 border rounded" value={form.raised_amount} onChange={e => handleChange('raised_amount', Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-2">Status</label>
              <select className="w-full p-2 border rounded" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                <option value="pending">pending</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
                <option value="completed">completed</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Priority Score</label>
              <input type="number" className="w-full p-2 border rounded" value={form.priority_score} onChange={e => handleChange('priority_score', Number(e.target.value))} />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <Button onClick={() => navigate('/admin/dashboard')} variant="outline">Cancel</Button>
            <Button onClick={approve} variant="secondary" disabled={!campaign?.documents?.length} isLoading={approving}>
              Approve Campaign
            </Button>
            <Button onClick={save} isLoading={saving}>Save Changes</Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6 mt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Supporting Documents</h2>
          {campaign?.documents?.length ? (
            <div className="space-y-3">
              {campaign.documents.map(document => (
                <div key={document.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{document.filename}</p>
                    <p className="text-sm text-slate-500">
                      {document.document_type || 'document'} · {new Date(document.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  <a href={resolveDocumentUrl(document.file_url)} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View file
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No supporting documents uploaded yet. Campaign approval remains disabled until documents are available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCampaignEditPage;
