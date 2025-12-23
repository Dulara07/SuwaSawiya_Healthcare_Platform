import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, User as UserIcon, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { LanguageToggle } from './LanguageToggle';
import { Button } from './ui/Button';
import LogoImg from '../LOGO/ChatGPT Image Aug 28, 2025, 05_02_43 PM.png';
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    t
  } = useLanguage();
  const {
    user,
    login,
    logout
  } = useUser();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={LogoImg} alt="SUWASAWIYA logo" className="h-10 w-10 object-cover rounded-md mr-3" />
              <span className="font-bold text-xl">
                Suwa<span className="text-blue-400">Sawiya</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className={`text-sm font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
              {t('nav.home')}
            </Link>
            <Link to="/campaigns" className={`text-sm font-medium ${isActive('/campaigns') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
              {t('nav.campaigns')}
            </Link>
            <Link to="/about" className={`text-sm font-medium ${isActive('/about') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
              {t('nav.about')}
            </Link>

            {user?.role === 'partner' && <Link to="/partner/dashboard" className={`text-sm font-medium ${isActive('/partner/dashboard') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
                {t('nav.dashboard')}
              </Link>}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <LanguageToggle />

            {user ? <div className="flex items-center space-x-3 ml-4 border-l pl-4 border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-gray-600" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div> : <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="sm" onClick={() => login('donor')}>
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={() => login('partner')}>
                  Partner Login
                </Button>
              </div>}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <LanguageToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              {t('nav.home')}
            </Link>
            <Link to="/campaigns" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              {t('nav.campaigns')}
            </Link>

            {user?.role === 'partner' && <Link to="/partner/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50" onClick={() => setIsMenuOpen(false)}>
                {t('nav.dashboard')}
              </Link>}

            {!user && <div className="pt-4 pb-2 border-t border-gray-100 mt-2">
                <div className="space-y-2 px-3">
                  <Button fullWidth variant="outline" onClick={() => {
              login('donor');
              setIsMenuOpen(false);
            }}>
                    Donor Login
                  </Button>
                  <Button fullWidth variant="primary" onClick={() => {
              login('partner');
              setIsMenuOpen(false);
            }}>
                    Admin
                  </Button>
                </div>
              </div>}

            {user && <div className="pt-4 pb-2 border-t border-gray-100 mt-2 px-3">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-gray-700">{user.name}</span>
                </div>
                <Button fullWidth variant="outline" onClick={() => {
            logout();
            setIsMenuOpen(false);
          }}>
                  Logout
                </Button>
              </div>}
          </div>
        </div>}
    </header>;
}