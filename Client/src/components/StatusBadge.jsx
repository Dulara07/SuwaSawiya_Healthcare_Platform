import React from 'react';
export function StatusBadge({ status, type }) {
  const getStyles = (type) => {
    switch (type) {
      case 'active':
      case 'stable':
        return 'bg-[#E6F6EC] text-[#00A651] border-[#00A651]/20';
      case 'critical':
        return 'bg-[#FFEBEB] text-[#E63946] border-[#E63946]/20';
      case 'pending':
        return 'bg-[#FFF8E1] text-[#B38600] border-[#FFB800]/20';
      case 'discharged':
        return 'bg-[#F0F2F5] text-[#5C6B7F] border-[#5C6B7F]/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };
  return <span className={`
        inline-flex items-center px-2.5 py-0.5 
        rounded-[2px] text-xs font-bold uppercase tracking-wide border
        ${getStyles(type)}
      `}>{status}</span>;
}
