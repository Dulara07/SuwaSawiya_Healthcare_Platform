import React from 'react';
import { MOCK_CAMPAIGNS } from '../data/mockData';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Plus, DollarSign, Users, FileText } from 'lucide-react';
export function PartnerDashboardPage() {
  const myCampaigns = MOCK_CAMPAIGNS.slice(0, 3);
  const totalRaised = myCampaigns.reduce((acc, curr) => acc + curr.raisedAmount, 0);
  return <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Partner Dashboard
          </h1>
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" /> New Campaign
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Raised
              </h3>
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              LKR {totalRaised.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Active Campaigns
              </h3>
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {myCampaigns.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Pending Review
              </h3>
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Managed Campaigns</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Raised</th>
                  <th className="px-6 py-3">Goal</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myCampaigns.map(campaign => <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {campaign.title}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-6 py-4 text-green-600 font-medium">
                      {campaign.currency}{' '}
                      {campaign.raisedAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {campaign.currency} {campaign.goalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-3">
                        Edit
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 font-medium text-xs">
                        View
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
}
