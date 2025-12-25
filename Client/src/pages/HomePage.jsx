import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CampaignCard } from '../components/CampaignCard';
import { MOCK_CAMPAIGNS } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
export function HomePage() {
  const { t } = useLanguage();
  const featuredCampaigns = [...MOCK_CAMPAIGNS].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 3);
  return <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/75"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/partner/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold shadow-lg shadow-emerald-900/20">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/campaigns">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10 hover:text-white">
                  {t('hero.secondaryCta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Trust Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">150M+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Raised
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12k+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Donors
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Verified
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Patients Helped
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Urgent Cases
              </h2>
              <p className="text-gray-600">
                These patients need your help immediately.
              </p>
            </div>
            <Link to="/campaigns" className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-700">
              View all campaigns <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampaigns.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} />)}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link to="/campaigns">
              <Button variant="outline" fullWidth>
                View All Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Surgery', 'Cancer', 'Emergency', 'Transplant', 'Medication', 'Therapy'].map(cat => <Link key={cat} to={`/campaigns?category=${cat}`} className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-all group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">{cat}</span>
              </Link>)}
          </div>
        </div>
      </section>
    </div>;
}
