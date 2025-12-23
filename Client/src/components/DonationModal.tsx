import React, { useState } from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Campaign } from '../types';
interface DonationModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}
export function DonationModal({
  campaign,
  isOpen,
  onClose
}: DonationModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  if (!isOpen) return null;
  const handleDonate = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Redirecting to payment gateway...');
      onClose();
    }, 1500);
  };
  const presetAmounts = [1000, 2500, 5000, 10000];
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">
            Donate to {campaign.patientName}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 1 ? <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Amount ({campaign.currency})
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {presetAmounts.map(val => <button key={val} onClick={() => setAmount(val.toString())} className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${amount === val.toString() ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 hover:border-blue-300 text-gray-700'}`}>
                      {val.toLocaleString()}
                    </button>)}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    {campaign.currency}
                  </span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Other Amount" className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Your donation is protected. 100% of funds go directly to the
                  verified hospital account for {campaign.patientName}.
                </p>
              </div>

              <Button fullWidth size="lg" disabled={!amount} onClick={() => setStep(2)}>
                Continue
              </Button>
            </div> : <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Your Name (Optional)
                </label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe" />

                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="john@example.com" />

                <div className="flex items-center mt-2">
                  <input id="anonymous" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                    Make my donation anonymous
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Button fullWidth size="lg" isLoading={isLoading} onClick={handleDonate} className="flex items-center justify-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Pay {campaign.currency} {Number(amount).toLocaleString()}
                </Button>
                <button onClick={() => setStep(1)} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">
                  Back to amount
                </button>
              </div>
            </div>}
        </div>

        {/* Footer Trust */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-center items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <Lock className="w-3 h-3 mr-1" /> SSL Secure
          </span>
          <span>•</span>
          <span>Verified Partner</span>
        </div>
      </div>
    </div>;
}