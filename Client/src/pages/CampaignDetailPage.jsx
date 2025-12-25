import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_CAMPAIGNS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ProgressBar';
import { UrgencyBadge } from '../components/ui/Badge';
import { DonationModal } from '../components/DonationModal';
import { ShieldCheck, Calendar, User, Share2, AlertCircle } from 'lucide-react';
export function CampaignDetailPage() {
  const { id } = useParams();
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === id);
  if (!campaign) {
    return <div className="p-8 text-center">Campaign not found</div>;
  }
  return <div className="bg-gray-50 min-h-screen pb-12">
      <DonationModal campaign={campaign} isOpen={isDonateModalOpen} onClose={() => setIsDonateModalOpen(false)} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/campaigns" className="hover:text-blue-600">
              Campaigns
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate">
              {campaign.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <div className="relative h-64 md:h-96 w-full">
                <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <UrgencyBadge level={campaign.urgency} />
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {campaign.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Patient:{' '}
                    <span className="font-medium text-gray-900 ml-1">
                      {campaign.patientName}, {campaign.age}y
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created:{' '}
                    <span className="font-medium text-gray-900 ml-1">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    Verified by {campaign.partnerName}
                  </div>
                </div>

                <div className="prose prose-blue max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    The Story
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6">
                    {campaign.story}
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Medical Condition
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {campaign.description} Category: {campaign.category}
                  </p>
                </div>
              </div>
            </div>

            {/* Updates Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Updates</h3>
              {campaign.updates.length > 0 ? <div className="space-y-6">
                  {campaign.updates.map(update => <div key={update.id} className="border-l-2 border-blue-200 pl-4 pb-2">
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(update.date).toLocaleDateString()}
                      </p>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {update.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{update.content}</p>
                    </div>)}
                </div> : <p className="text-gray-500 italic">No updates yet.</p>}
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {campaign.currency} {campaign.raisedAmount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    of {campaign.currency}{' '}
                    {campaign.goalAmount.toLocaleString()}
                  </span>
                </div>
                <ProgressBar current={campaign.raisedAmount} total={campaign.goalAmount} label={false} size="lg" />
                <p className="text-sm text-gray-500 mt-2 text-right">
                  {Math.round(campaign.raisedAmount / campaign.goalAmount * 100)}
                  % Funded
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <Button fullWidth size="lg" onClick={() => setIsDonateModalOpen(true)} className="shadow-md shadow-blue-200">
                  Donate Now
                </Button>
                <Button fullWidth variant="outline" className="flex items-center justify-center">
                  <Share2 className="w-4 h-4 mr-2" /> Share Campaign
                </Button>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">
                    Urgent Need
                  </h4>
                  <p className="text-xs text-amber-700 mt-1">
                    This campaign expires on{' '}
                    {new Date(campaign.deadline).toLocaleDateString()}. Please
                    help before it's too late.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Top Donors
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold mr-2">
                        JD
                      </div>
                      <span className="text-gray-700">John Doe</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      LKR 50,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold mr-2">
                      A
                    </div>
                    <span className="text-gray-700">Anonymous</span>
                  </div>
                  <span className="font-medium text-gray-900">LKR 25,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
