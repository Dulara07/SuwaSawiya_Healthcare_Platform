import React, { useState } from 'react';
import { CheckCircle2, Upload, Building2, User, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
export function PartnerRegisterPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitted(true);
    }
  };
  if (isSubmitted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Submitted
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering as a partner. Our admin team will review
            your documents and verify your organization within 24-48 hours.
          </p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
            {[1, 2, 3].map(s => <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                {s}
              </div>)}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
            <span>Organization</span>
            <span>Patient Details</span>
            <span>Documents</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <h1 className="text-xl font-bold text-gray-900">
              {step === 1 && 'Organization Details'}
              {step === 2 && 'Initial Patient Registration'}
              {step === 3 && 'Verification Documents'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 && 'Tell us about your hospital or NGO.'}
              {step === 2 && 'Register your first patient case.'}
              {step === 3 && 'Upload medical proof and ID.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {step === 1 && <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="City General Hospital" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="REG-123456" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Dr. Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Official Email
                  </label>
                  <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="admin@hospital.com" />
                </div>
              </div>}

            {step === 2 && <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="text" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input type="number" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Condition
                  </label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Acute Leukemia" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Goal (LKR)
                  </label>
                  <input type="number" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="500,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Story / Description
                  </label>
                  <textarea required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Describe the patient's situation..."></textarea>
                </div>
              </div>}

            {step === 3 && <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900">
                    Upload Medical Report
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF or JPG up to 5MB
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900">
                    Upload NIC / Identity Proof
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Front and back</p>
                </div>

                <div className="flex items-start bg-blue-50 p-4 rounded-md">
                  <input type="checkbox" required className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label className="ml-2 text-sm text-blue-800">
                    I certify that the information provided is true and
                    accurate. I understand that false claims will result in
                    immediate account termination and legal action.
                  </label>
                </div>
              </div>}

            <div className="flex justify-between pt-4 border-t border-gray-100">
              {step > 1 ? <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button> : <div></div>}
              <Button type="submit">
                {step === 3 ? 'Submit Registration' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>;
}