import React, { useState } from 'react';
import { CheckCircle2, Upload, Building2, User, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { register } from '../api';

export function PartnerRegisterPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Organization details
  const [orgName, setOrgName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  
  // Step 2: Patient details
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [patientStory, setPatientStory] = useState('');
  
  // Step 3: Documents (for future use)
  const [medicalReport, setMedicalReport] = useState(null);
  const [idProof, setIdProof] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit registration
      setLoading(true);
      try {
        // Validate inputs
        if (!orgName.trim()) throw new Error('Organization name is required');
        if (!contactPerson.trim()) throw new Error('Contact person name is required');
        if (!officialEmail.trim()) throw new Error('Official email is required');
        if (!regNumber.trim()) throw new Error('Registration number is required');
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(officialEmail)) {
          throw new Error('Please enter a valid email address');
        }
        
        // Generate username (must be 3+ chars, max 50)
        const emailPrefix = officialEmail.split('@')[0];
        let username = emailPrefix;
        if (username.length < 3) {
          username = `user_${orgName.replace(/\s+/g, '_').substring(0, 40)}`;
        }
        username = username.substring(0, 50).toLowerCase();
        
        if (username.length < 3) {
          throw new Error('Cannot generate valid username. Please use a longer organization name or email.');
        }
        
        // Generate password (must be 6+ chars, max 72 bytes for bcrypt)
        // Simple: use registration number + timestamp suffix
        const timestamp = Date.now().toString().slice(-4);
        let password = `${regNumber.substring(0, 20)}${timestamp}`;
        
        // Ensure it's at least 6 characters
        while (password.length < 6) {
          password = password + 'P';
        }
        
        // Ensure it's not too long (bcrypt limit is 72)
        password = password.substring(0, 50);
        
        const registrationData = {
          username,
          password,
          email: officialEmail,
          full_name: contactPerson,
          role: 'partner'
        };
        
        console.log('=== REGISTRATION DEBUG INFO ===');
        console.log('Sending registration with data:', registrationData);
        console.log('Data types:', {
          username: typeof registrationData.username,
          password: typeof registrationData.password,
          email: typeof registrationData.email,
          full_name: typeof registrationData.full_name,
          role: typeof registrationData.role,
        });
        console.log('Data values check:', {
          username_length: registrationData.username.length,
          password_length: registrationData.password.length,
          email_valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email),
          full_name_length: registrationData.full_name.length,
        });
        
        // Register the partner account
        const response = await register(registrationData);
        
        console.log('Registration successful:', response);
        setIsSubmitted(true);
      } catch (err) {
        console.error('Registration error:', err);
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
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
            <span>Verification</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <h1 className="text-xl font-bold text-gray-900">
              {step === 1 && 'Organization Details'}
              {step === 2 && 'Initial Patient Registration'}
              {step === 3 && 'Verification'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 && 'Tell us about your hospital or NGO.'}
              {step === 2 && 'Register your first patient case.'}
              {step === 3 && 'Review and submit your information.'}
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
                    <input 
                      type="text" 
                      required 
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="City General Hospital" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="REG-123456" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Dr. Smith" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Official Email
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="admin@hospital.com" 
                  />
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
                      <input 
                        type="text" 
                        required 
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input 
                      type="number" 
                      required 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Condition
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={medicalCondition}
                    onChange={(e) => setMedicalCondition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="e.g. Acute Leukemia" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Goal (LKR)
                  </label>
                  <input 
                    type="number" 
                    required 
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="500,000" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Story / Description
                  </label>
                  <textarea 
                    required 
                    rows={4} 
                    value={patientStory}
                    onChange={(e) => setPatientStory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Describe the patient's situation..."
                  ></textarea>
                </div>
              </div>}

            {step === 3 && <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Review Your Information</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Organization:</strong> {orgName}</p>
                    <p><strong>Contact:</strong> {contactPerson}</p>
                    <p><strong>Email:</strong> {officialEmail}</p>
                    <p><strong>Patient:</strong> {patientName} ({age} years)</p>
                    <p><strong>Condition:</strong> {medicalCondition}</p>
                    <p><strong>Funding Goal:</strong> LKR {fundingGoal}</p>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900">
                    Upload Medical Report
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF or JPG up to 5MB
                  </p>
                </div>
              </div>}
            
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : step === 3 ? 'Submit Registration' : 'Next Step'}
            </button>
          </form>
        </div>
      </div>
    </div>;
}
