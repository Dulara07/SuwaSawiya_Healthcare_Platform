import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { CampaignCard } from '../components/CampaignCard';
import { SkeletonCard, SkeletonGrid } from '../components/Skeleton';
import { fetchCampaigns } from '../api';
export function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCampaigns()
      .then(data => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load campaigns. Please try again later.');
        setLoading(false);
      });
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = (campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) || campaign.patientName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'All' || campaign.urgency === selectedUrgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  return <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filters */}
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Active Campaigns</h1>
            <p className="text-gray-600 mt-1">Browse and support patients in need</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search by patient name or condition..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>

              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <select className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Cancer Treatment">Cancer</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Transplant">Transplant</option>
                </select>

                <select className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" value={selectedUrgency} onChange={e => setSelectedUrgency(e.target.value)}>
                  <option value="All">All Urgency</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Status */}
        {!loading && !error && filteredCampaigns.length > 0 && (
          <p className="text-sm text-gray-600 mb-4">Showing <span className="font-semibold">{filteredCampaigns.length}</span> campaign{filteredCampaigns.length !== 1 ? 's' : ''}</p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Unable to Load Campaigns
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
              Try Again
            </button>
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No campaigns found
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>;
}
