import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StatsCard } from './StatsCard';
import { PatientTable } from './PatientTable';
import { Users, ClipboardList, Activity, Clock } from 'lucide-react';
export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  return <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pl-[240px] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Clinical Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Hospital Ward A • Shift 2 (08:00 - 16:00)</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-[#E0E0E0] text-gray-700 text-sm font-bold rounded-[2px] hover:bg-gray-50 transition-colors">Export Report</button>
              <button className="px-4 py-2 bg-[#0066CC] text-white text-sm font-bold rounded-[2px] hover:bg-[#0052A3] shadow-sm transition-colors">+ New Admission</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Total Patients" value="142" trend="+4.5%" trendDirection="up" icon={Users} />
            <StatsCard title="Critical Cases" value="8" trend="-2" trendDirection="down" icon={Activity} />
            <StatsCard title="Pending Labs" value="24" trend="+12" trendDirection="neutral" icon={ClipboardList} />
            <StatsCard title="Avg Wait Time" value="18m" trend="-2m" trendDirection="up" icon={Clock} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PatientTable />
              <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Department Capacity</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">ICU Capacity</span><span className="font-bold text-gray-900">85%</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-[#E63946] h-2 rounded-full" style={{width: '85%'}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">General Ward</span><span className="font-bold text-gray-900">62%</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-[#0066CC] h-2 rounded-full" style={{width: '62%'}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">Emergency Room</span><span className="font-bold text-gray-900">45%</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-[#00A651] h-2 rounded-full" style={{width: '45%'}}></div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-[#E0E0E0] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="px-4 py-3 border-b border-[#E0E0E0] flex justify-between items-center bg-white">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Doctor Schedule</h3>
                  <button className="text-xs font-medium text-[#0066CC]">View All</button>
                </div>
                <div className="divide-y divide-[#E0E0E0]">
                  {[{time: '09:00', event: 'Ward Rounds', doctor: 'Dr. S. Chen', type: 'routine'}, {time: '10:30', event: 'Surgery: Appendectomy', doctor: 'Dr. J. Wilson', type: 'urgent'}, {time: '13:00', event: 'Staff Meeting', doctor: 'All Staff', type: 'meeting'}, {time: '14:30', event: 'Patient Consults', doctor: 'Dr. A. Miller', type: 'routine'}].map((item, i) => <div key={i} className="p-3 flex gap-3 hover:bg-[#FAFAFA] transition-colors"><div className="w-12 text-xs font-bold text-gray-500 pt-1">{item.time}</div><div><div className="text-sm font-bold text-gray-900">{item.event}</div><div className="text-xs text-gray-500 mt-0.5">{item.doctor}</div></div><div className={`ml-auto w-2 h-2 rounded-full mt-2 ${item.type === 'urgent' ? 'bg-[#E63946]' : item.type === 'meeting' ? 'bg-[#FFB800]' : 'bg-[#0066CC]'}`}></div></div>)}
                </div>
              </div>
              <div className="bg-[#0066CC] rounded-[2px] p-5 text-white shadow-md">
                <h3 className="font-bold text-lg mb-1">Emergency Protocol</h3>
                <p className="text-blue-100 text-sm mb-4">Quick access to emergency response codes and rapid response teams.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-white text-[#E63946] text-xs font-bold py-2 px-3 rounded-[2px] hover:bg-red-50 transition-colors uppercase tracking-wide">Code Blue</button>
                  <button className="bg-[#0052A3] text-white text-xs font-bold py-2 px-3 rounded-[2px] border border-blue-400 hover:bg-[#004080] transition-colors uppercase tracking-wide">Code Red</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>;
}
