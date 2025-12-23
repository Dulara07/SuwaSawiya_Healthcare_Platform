import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { CampaignCard } from '../components/CampaignCard';
import { MOCK_CAMPAIGNS } from '../data/mockData';
import { CampaignCategory, UrgencyLevel } from '../types';
export function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CampaignCategory | 'All'>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel | 'All'>('All');
  const filteredCampaigns = MOCK_CAMPAIGNS.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || campaign.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'All' || campaign.urgency === selectedUrgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });
  return <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filters */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Active Campaigns</h1>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search by patient name or condition..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
              <select className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as any)}>
                <option value="All">All Categories</option>
                <option value="Surgery">Surgery</option>
                <option value="Cancer Treatment">Cancer</option>
                <option value="Emergency">Emergency</option>
                <option value="Transplant">Transplant</option>
              </select>

              <select className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500" value={selectedUrgency} onChange={e => setSelectedUrgency(e.target.value as any)}>
                <option value="All">All Urgency</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredCampaigns.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} />)}
          </div> : <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No campaigns found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>}
      </div>
    </div>;
}