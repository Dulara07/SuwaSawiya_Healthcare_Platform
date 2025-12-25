import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LogoImg from '../LOGO/ChatGPT Image Aug 28, 2025, 05_02_43 PM.png';
export function Footer() {
  const { t } = useLanguage();
  return <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <img src={LogoImg} alt="SUWASAWIYA logo" className="h-10 w-10 object-cover rounded-md mr-3" />
              <span className="font-bold text-xl">Suwa<span className="text-blue-400">Sawiya</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">Connecting compassionate hearts with those in critical need. Secure, transparent, and direct medical crowdfunding.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm">Home</Link></li>
              <li><Link to="/campaigns" className="text-gray-400 hover:text-white text-sm">Browse Campaigns</Link></li>
              <li><Link to="/partner/register" className="text-gray-400 hover:text-white text-sm">Partner with Us</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">How it Works</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Transparency Report</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start"><MapPin className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" /><span className="text-gray-400 text-sm">123 Hospital Road, Colombo 07, Sri Lanka</span></li>
              <li className="flex items-center"><Phone className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" /><span className="text-gray-400 text-sm">+94 11 234 5678</span></li>
              <li className="flex items-center"><Mail className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" /><span className="text-gray-400 text-sm">help@healthbridge.lk</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center"><p className="text-gray-500 text-sm">{t('footer.rights')}</p></div>
      </div>
    </footer>;
}
