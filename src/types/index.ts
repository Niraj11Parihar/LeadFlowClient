export type LeadStage = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON' | 'LOST';

export type FollowUpStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'MISSED';

export type ActivityType =
  | 'LEAD_CREATED'
  | 'LEAD_UPDATED'
  | 'STAGE_CHANGED'
  | 'FOLLOWUP_SCHEDULED'
  | 'FOLLOWUP_COMPLETED'
  | 'FOLLOWUP_RESCHEDULED'
  | 'FOLLOWUP_CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  stage: LeadStage;
  followUpAt?: string | null;
  nextFollowUpAt?: string | null;
  lastFollowUpAt?: string | null;
  lastActivityAt?: string | null;
  notes?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  userId: string;
  sequenceNumber: number;
  status: FollowUpStatus;
  scheduledAt: string;
  completedAt?: string | null;
  communicationMedium?: string | null;
  communicationMediumNormalized?: string | null;
  discussionNote?: string | null;
  outcome?: string | null;
  nextFollowUpAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  userId: string;
  type: ActivityType;
  description?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  search?: string;
  stage?: LeadStage | '';
  followUp?: 'today' | 'overdue' | 'upcoming' | 'none' | '';
  sortBy?: 'createdAt' | 'name' | 'company' | 'stage' | 'nextFollowUpAt' | 'lastActivityAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  total: number;
  stages: {
    new: number;
    contacted: number;
    qualified: number;
    won: number;
    lost: number;
  };
  followUps: {
    today: number;
    overdue: number;
  };
  todayFollowUps: Array<{
    id: string;
    name: string;
    company?: string | null;
    stage: LeadStage;
    followUpAt?: string | null;
    phone?: string | null;
    email?: string | null;
  }>;
  overdueFollowUps: Array<{
    id: string;
    name: string;
    company?: string | null;
    stage: LeadStage;
    followUpAt?: string | null;
    phone?: string | null;
    email?: string | null;
  }>;
}
