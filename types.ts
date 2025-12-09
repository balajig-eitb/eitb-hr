import React from 'react';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Remote';
  email: string;
  avatar: string;
  joinDate: string;
}

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  role: string;
  experience: number;
  currentCompany?: string;
  education?: string;
  skills: string[];
  linkedin?: string;
  portfolio?: string;
  noticePeriod?: string;
  expectedSalary?: string;
  status: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  summary?: string; // AI Generated
  avatar?: string;
  appliedDate?: string;
  matchScore?: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  color: string;
}

export interface ResumeAnalysisResult {
  name: string;
  email: string;
  skills: string[];
  education: string;
  experienceYears: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  matchScore: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CANDIDATES = 'CANDIDATES',
  RECRUITMENT = 'RECRUITMENT',
  JD_GENERATOR = 'JD_GENERATOR',
  RESUME_ANALYZER = 'RESUME_ANALYZER',
  SETTINGS = 'SETTINGS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ADD_CANDIDATE = 'ADD_CANDIDATE'
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'alert' | 'info' | 'success';
}
