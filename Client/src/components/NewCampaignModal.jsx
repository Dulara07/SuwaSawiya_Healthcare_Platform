import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createCampaign } from '../api';
import { Button } from './ui/Button';

export function NewCampaignModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    medical_urgency: 3,
    time_sensitivity: 3,
    target_amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (form.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (!form.target_amount || parseFloat(form.target_amount) <= 0) newErrors.target_amount = 'Target amount must be greater than 0';
    if (form.target_amount > 50000000) newErrors.target_amount = 'Target amount cannot exceed 50,000,000 LKR';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await createCampaign(form);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setForm({ title: '', description: '', medical_urgency: 3, time_sensitivity: 3, target_amount: '' });
        setErrors({});
        onSuccess && onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to create campaign' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center animate-in scale-in duration-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Created!</h2>
          <p className="text-gray-600">Your campaign has been submitted for review. Our team will verify your information within 24-48 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white sticky top-0">
          <h2 className="text-xl font-bold text-gray-900">Create New Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title *</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="e.g., Emergency Heart Surgery for Sarah" 
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none transition-colors ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Provide details about the patient's condition and funding need..." 
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none transition-colors resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            <div className="flex justify-between items-end mt-1">
              {errors.description && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.description}</p>}
              <p className="text-gray-400 text-xs">{form.description.length}/500</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Urgency</label>
              <select 
                name="medical_urgency" 
                value={form.medical_urgency} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Low (1)</option>
                <option value={2}>Moderate (2)</option>
                <option value={3}>High (3)</option>
                <option value={4}>Very High (4)</option>
                <option value={5}>Critical (5)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Sensitivity</label>
              <select 
                name="time_sensitivity" 
                value={form.time_sensitivity} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Low (1)</option>
                <option value={2}>Moderate (2)</option>
                <option value={3}>High (3)</option>
                <option value={4}>Very High (4)</option>
                <option value={5}>Urgent (5)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (LKR) *</label>
            <input 
              name="target_amount" 
              type="number" 
              value={form.target_amount} 
              onChange={handleChange} 
              placeholder="500000" 
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none transition-colors ${errors.target_amount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {errors.target_amount && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.target_amount}</p>}
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <Button variant="outline" onClick={onClose} fullWidth>Cancel</Button>
            <Button type="submit" disabled={loading} isLoading={loading} fullWidth>
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
