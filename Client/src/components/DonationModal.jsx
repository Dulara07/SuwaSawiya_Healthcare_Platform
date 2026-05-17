import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
export function DonationModal({ campaign, isOpen, onClose }) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!isAnonymous && !donorEmail) {
      newErrors.email = 'Email is required for non-anonymous donations';
    }
    if (donorEmail && !validateEmail(donorEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDonate = () => {
    if (!validateStep2()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        setDonorName('');
        setDonorEmail('');
        setIsAnonymous(false);
        setStep(1);
        onClose();
      }, 2500);
    }, 1500);
  };

  const presetAmounts = [1000, 2500, 5000, 10000];

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in scale-in duration-300 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Donation Successful!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for donating {campaign.currency} {Number(amount).toLocaleString()} to {campaign.patientName}. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Your generosity will help save a life.</p>
            <p className="font-medium text-gray-900">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Support {campaign.patientName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount ({campaign.currency})</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {presetAmounts.map(val => (
                    <button key={val} onClick={() => { setAmount(val.toString()); setErrors({}); }} className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${amount === val.toString() ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 hover:border-blue-300 text-gray-700'}`}>{val.toLocaleString()}</button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{campaign.currency}</span>
                  <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setErrors({}); }} placeholder="Other Amount" className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 outline-none transition-shadow ${errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} />
                </div>
                {errors.amount && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.amount}</p>}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">Your donation is secure and protected. 100% of funds reach the verified hospital account.</p>
              </div>
              <Button fullWidth size="lg" disabled={!amount} onClick={() => { if (validateStep1()) setStep(2); }}>Continue to Details</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name (Optional)</label>
                  <input type="text" value={donorName} onChange={e => setDonorName(e.target.value)} disabled={isAnonymous} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" value={donorEmail} onChange={e => { setDonorEmail(e.target.value); setErrors({}); }} disabled={isAnonymous} className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-blue-500 outline-none transition-shadow disabled:bg-gray-50 disabled:text-gray-400 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} placeholder="john@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>
                <div className="flex items-center">
                  <input id="anonymous" type="checkbox" checked={isAnonymous} onChange={e => { setIsAnonymous(e.target.checked); setErrors({}); }} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">Make my donation anonymous</label>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-800">Your donation will be processed securely via our partner payment gateway.</p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button size="lg" variant="outline" onClick={() => setStep(1)} fullWidth>Back</Button>
                <Button size="lg" isLoading={isLoading} onClick={handleDonate} fullWidth className="inline-flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Pay {campaign.currency} {Number(amount).toLocaleString()}
                </Button>
              </div>
            </div>
          )}
        </div>
        {step === 1 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-center items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center"><Lock className="w-3 h-3 mr-1" /> SSL Secure</span>
            <span>•</span>
            <span>Verified Partner</span>
          </div>
        )}
      </div>
    </div>
  );
}
