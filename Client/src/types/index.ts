export type UserRole = 'donor' | 'partner' | 'admin' | 'guest';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
export type CampaignCategory = 'Surgery' | 'Cancer Treatment' | 'Emergency' | 'Transplant' | 'Medication' | 'Therapy';
export type CampaignStatus = 'Pending' | 'Active' | 'Funded' | 'Rejected';
export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export interface Campaign {
  id: string;
  title: string;
  patientName: string;
  age: number;
  category: CampaignCategory;
  description: string;
  story: string;
  imageUrl: string;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  deadline: string;
  status: CampaignStatus;
  urgency: UrgencyLevel;
  priorityScore: number; // 1-10 for ML sorting
  partnerId: string;
  partnerName: string;
  verified: boolean;
  updates: CampaignUpdate[];
  createdAt: string;
}
export interface CampaignUpdate {
  id: string;
  date: string;
  title: string;
  content: string;
}
export interface Donation {
  id: string;
  campaignId: string;
  amount: number;
  donorName: string; // 'Anonymous' if hidden
  date: string;
}
export type Language = 'en' | 'si' | 'ta';