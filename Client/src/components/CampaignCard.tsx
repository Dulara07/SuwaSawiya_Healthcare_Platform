import React from 'react';
import { Link } from 'react-router-dom';
import { Campaign } from '../types';
import { UrgencyBadge } from './ui/Badge';
import { ProgressBar } from './ProgressBar';
import { ShieldCheck, Clock } from 'lucide-react';
interface CampaignCardProps {
  campaign: Campaign;
}
export function CampaignCard({
  campaign
}: CampaignCardProps) {
  const percent = Math.round(campaign.raisedAmount / campaign.goalAmount * 100);
  return <Link to={`/campaigns/${campaign.id}`} className="group flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3">
          <UrgencyBadge level={campaign.urgency} />
        </div>
        {campaign.verified && <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-xs font-medium text-blue-700 shadow-sm">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Verified
          </div>}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
            {campaign.category}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(campaign.deadline).toLocaleDateString()} left
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {campaign.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {campaign.description}
        </p>

        {/* Progress Section */}
        <div className="mt-auto space-y-3">
          <ProgressBar current={campaign.raisedAmount} total={campaign.goalAmount} size="sm" />

          <div className="flex justify-between items-end">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {campaign.currency} {campaign.raisedAmount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                raised of {campaign.currency}{' '}
                {campaign.goalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>;
}