import React, { useEffect, useState } from 'react';
export function ProgressBar({ current, total, label = true, size = 'md', showPercentage = true }) {
  const percentage = Math.min(Math.round(current / total * 100), 100);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };
  return <div className="w-full">
      {label && <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">Raised</span>
          {showPercentage && <span className="font-bold text-blue-600">{percentage}%</span>}
        </div>}
      <div className={`w-full bg-gray-200 rounded-full ${heights[size]} overflow-hidden`}>
        <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" style={{
        width: `${width}%`
      }}></div>
      </div>
    </div>;
}
