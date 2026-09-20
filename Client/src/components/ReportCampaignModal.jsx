import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Flag, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { useUser } from '../contexts/UserContext';
import { createFraudReport } from '../api';

export function ReportCampaignModal({ campaign, isOpen, onClose }) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError('Please log in before reporting a campaign');
      return;
    }
    if (reason.trim().length < 10) {
      setError('Please describe your concern in at least 10 characters');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await createFraudReport({ campaignId: campaign.id, reason: reason.trim() });
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setReason('');
        onClose();
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to submit report');
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Report Submitted</h3>
          <p className="text-gray-600">
            Thank you for helping keep the platform trustworthy. Our administrators will review this campaign.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
          <div>
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-600" /> Report Campaign
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{campaign.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Let us know what looks wrong &mdash; duplicate campaign, misleading information, fake documents, or anything else that raised a concern.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What's the issue?</label>
            <textarea
              value={reason}
              onChange={e => { setReason(e.target.value); setError(null); }}
              rows={4}
              placeholder="Describe why this campaign looks suspicious..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}

          {!isAuthenticated ? (
            <Button variant="outline" fullWidth onClick={() => { onClose(); navigate('/login/donor'); }}>
              Log in to report
            </Button>
          ) : (
            <Button fullWidth size="lg" variant="danger" isLoading={isLoading} onClick={handleSubmit}>
              Submit Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
