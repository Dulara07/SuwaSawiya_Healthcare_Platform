import React from 'react';
import { UrgencyLevel, CampaignStatus } from '../../types';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}
export function Badge({
  children,
  variant = 'default',
  className = ''
}: BadgeProps) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800'
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>;
}
export function UrgencyBadge({
  level
}: {
  level: UrgencyLevel;
}) {
  const map: Record<UrgencyLevel, BadgeProps['variant']> = {
    Low: 'neutral',
    Medium: 'default',
    High: 'warning',
    Critical: 'danger'
  };
  return <Badge variant={map[level]}>{level} Urgency</Badge>;
}
export function StatusBadge({
  status
}: {
  status: CampaignStatus;
}) {
  const map: Record<CampaignStatus, BadgeProps['variant']> = {
    Pending: 'warning',
    Active: 'success',
    Funded: 'default',
    Rejected: 'danger'
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}