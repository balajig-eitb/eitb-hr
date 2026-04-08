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
  firstname: string;
  lastname: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  role: string;
  job_role : string;
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
  ROLES =  'ROLES',
  CANDIDATES = 'CANDIDATES',
  RECRUITMENT = 'RECRUITMENT',
  JD_GENERATOR = 'JD_GENERATOR',
  RESUME_ANALYZER = 'RESUME_ANALYZER',
  SETTINGS = 'SETTINGS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ADD_CANDIDATE = 'ADD_CANDIDATE',
  ADD_ROLE = 'ADD_ROLE',
  USERS = 'USERS',
  ADD_USER = 'ADD_USER'

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

export interface Roles{
  id: string,
  code: string,
  name: string,
  description: string,
  create_at:  string,
  active: boolean
}


export interface Users{
  id: string,
  code: string,
  name: string,
  user_name : string,
  description: string,
  create_at:  string,
  active: boolean,
  role: string,
  permission: JSON,
  password: string,
  avatar: string
}