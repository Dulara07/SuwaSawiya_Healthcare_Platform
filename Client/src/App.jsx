import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignDetailPage } from './pages/CampaignDetailPage';
import { PartnerRegisterPage } from './pages/PartnerRegisterPage';
import { PartnerDashboardPage } from './pages/PartnerDashboardPage';
// Protected Route Wrapper
function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useUser();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
export function App() {
  return <LanguageProvider>
      <UserProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="/partner/register" element={<PartnerRegisterPage />} />
              <Route path="/about" element={<div className="p-8 text-center">About Page Placeholder</div>} />

              {/* Protected Partner Routes */}
              <Route path="/partner/dashboard" element={<ProtectedRoute role="partner">
                    <PartnerDashboardPage />
                  </ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </UserProvider>
    </LanguageProvider>;
}
