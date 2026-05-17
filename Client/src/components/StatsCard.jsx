import React from 'react';
export function StatsCard({ title, value, trend, trendDirection, icon: Icon }) {
  return <div className="bg-white border border-[#E0E0E0] rounded-[2px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className="p-1.5 bg-[#F0F7FF] rounded-[2px]"><Icon className="w-4 h-4 text-[#0066CC]" /></div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">{value}</span>
        {trend && <span className={`text-xs font-medium px-1.5 py-0.5 rounded-[2px] ${trendDirection === 'up' ? 'text-[#00A651] bg-[#E6F6EC]' : trendDirection === 'down' ? 'text-[#E63946] bg-[#FFEBEB]' : 'text-gray-600 bg-gray-100'}`}>{trend}</span>}
      </div>
    </div>;
}
