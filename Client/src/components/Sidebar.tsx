import React from 'react';
import { LayoutDashboard, Users, Calendar, FileText, Settings, Activity, LogOut, Bell } from 'lucide-react';
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export function Sidebar({
  activeTab,
  setActiveTab
}: SidebarProps) {
  const menuItems = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  }, {
    id: 'patients',
    label: 'Patients',
    icon: Users
  }, {
    id: 'appointments',
    label: 'Appointments',
    icon: Calendar
  }, {
    id: 'reports',
    label: 'Clinical Reports',
    icon: FileText
  }, {
    id: 'settings',
    label: 'System Settings',
    icon: Settings
  }];
  return <aside className="w-[240px] bg-white border-r border-[#E0E0E0] flex flex-col h-screen fixed left-0 top-0 z-20 shadow-[1px_0_3px_rgba(0,0,0,0.05)]">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-5 border-b border-[#E0E0E0]">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#0066CC] p-1.5 rounded-[2px]">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none tracking-tight">
              HealthBridge
            </h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
              Clinical Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="mb-4 px-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Main Module
          </p>
        </div>

        {menuItems.map(item => {
        const isActive = activeTab === item.id;
        return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`
                w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-[2px] transition-colors
                ${isActive ? 'bg-[#0066CC] text-white shadow-sm' : 'text-gray-600 hover:bg-[#F5F5F5] hover:text-gray-900'}
              `}>
              <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              {item.label}
            </button>;
      })}

        <div className="mt-8 mb-4 px-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Notifications
          </p>
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-[2px] text-gray-600 hover:bg-[#F5F5F5] hover:text-gray-900 transition-colors">
          <div className="relative">
            <Bell className="w-4 h-4 text-gray-500" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#E63946] rounded-full border border-white"></span>
          </div>
          Alerts & Notices
        </button>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-[#E0E0E0] bg-[#FAFAFA]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-[2px] bg-[#E0E0E0] flex items-center justify-center text-xs font-bold text-gray-600">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              Dr. John Doe
            </p>
            <p className="text-xs text-gray-500 truncate">Chief of Medicine</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 border border-[#E0E0E0] rounded-[2px] hover:bg-white hover:text-[#E63946] transition-colors">
          <LogOut className="w-3 h-3" />
          Sign Out
        </button>
      </div>
    </aside>;
}