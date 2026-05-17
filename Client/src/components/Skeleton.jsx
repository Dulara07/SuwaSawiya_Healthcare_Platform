import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse h-full">
      <div className="h-48 w-full bg-gradient-to-r from-gray-200 to-gray-100"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="pt-3 space-y-2">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
    </tr>
  );
}

export function SkeletonGrid({ count = 3, columns = 3 }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
