import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, TrendingUp, Users, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CampaignCard } from '../components/CampaignCard';
import { SkeletonCard } from '../components/Skeleton';
import { MOCK_CAMPAIGNS } from '../data/mockData';
import { fetchCampaigns } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchFeed } from '../api';
export function HomePage() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchFeed()
      .then(data => {
        setCampaigns(data);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        setCampaigns(MOCK_CAMPAIGNS);
        setError(err.message || 'Unable to load feed');
        setLoading(false);
      });
  }, []);

  const featuredCampaigns = [...(campaigns || MOCK_CAMPAIGNS)].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 3);
  return <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-800/90"></div>
        
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full -mr-36 -mt-36 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-500">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <Link to="/partner/register" className="inline-block">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all hover:scale-105">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/campaigns" className="inline-block">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10 hover:text-white transition-all hover:scale-105">
                  {t('hero.secondaryCta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Trust Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">150M+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Raised
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12k+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Donors
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-100 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Verified
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 group hover:scale-105 transition-transform">
              <div className="p-3 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Patients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Urgent Cases
              </h2>
              <p className="text-gray-600 text-lg">
                These patients need your help immediately. Every donation makes a difference.
              </p>
            </div>
            <Link to="/campaigns" className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-700 hover:gap-2 transition-all gap-1">
              View all campaigns <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <p className="text-yellow-800 font-medium mb-2">Unable to load live campaigns</p>
              <p className="text-yellow-700 text-sm">Showing sample campaigns instead</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCampaigns.map((campaign, idx) => <div key={campaign.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{transitionDelay: `${idx * 100}ms`}}>
                  <CampaignCard campaign={campaign} />
                </div>)}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link to="/campaigns">
              <Button variant="outline" fullWidth className="h-11">
                View All Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <p className="text-gray-600 mt-2 text-lg">Find campaigns in your area of interest</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Surgery', 'Cancer', 'Emergency', 'Transplant', 'Medication', 'Therapy'].map((cat, idx) => <Link key={cat} to={`/campaigns?category=${cat}`} className="group flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500" style={{transitionDelay: `${idx * 50}ms`}}>
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-blue-100">
                  <Search className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                </div>
                <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{cat}</span>
              </Link>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to fundraise for a patient?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join our network of hospitals and NGOs to help patients get the medical care they need.
          </p>
          <Link to="/partner/register">
            <Button size="lg" variant="secondary" className="font-semibold shadow-lg shadow-blue-900/30 hover:shadow-xl transition-all">
              Register as a Partner
            </Button>
          </Link>
        </div>
      </section>
    </div>;
}
