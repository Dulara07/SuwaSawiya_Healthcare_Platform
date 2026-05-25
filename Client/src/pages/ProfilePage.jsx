import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/Button';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useUser();

  useEffect(() => {
    refreshUser?.();
  }, [refreshUser]);

  if (!user) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">My Profile</p>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">{user.name}</h1>
              <p className="text-slate-600 mt-2">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-medium capitalize">{user.role}</span>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 p-5 bg-slate-50 text-slate-600">
            Donation totals are tracked in the backend but are not displayed here.
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={() => navigate('/campaigns')}>Browse campaigns</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;