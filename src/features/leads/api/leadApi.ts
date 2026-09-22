import api from '../../../api/axios';
import type {
  ApiResponse,
  Lead,
  LeadFilters,
  FollowUp,
  LeadActivity,
  PaginatedResponse,
  LeadStage,
} from '../../../types';

export const leadApi = {
  getLeads: async (filters?: LeadFilters): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.stage) params.append('stage', filters.stage);
    if (filters?.followUp) params.append('followUp', filters.followUp);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination || {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        totalItems: response.data.data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  },

  createLead: async (data: Partial<Lead>): Promise<Lead> => {
    const response = await api.post<ApiResponse<Lead>>('/leads', data);
    return response.data.data;
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    const response = await api.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data.data;
  },

  deleteLead: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/leads/${id}`);
    return response.data.data;
  },

  // Follow-ups API
  getFollowUps: async (leadId: string, page = 1, limit = 10): Promise<PaginatedResponse<FollowUp>> => {
    const response = await api.get<ApiResponse<FollowUp[]>>(`/leads/${leadId}/follow-ups?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination || {
        page,
        limit,
        totalItems: response.data.data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  },

  createFollowUp: async (
    leadId: string,
    data: { scheduledAt: string; communicationMedium?: string; notes?: string }
  ): Promise<FollowUp> => {
    const response = await api.post<ApiResponse<FollowUp>>(`/leads/${leadId}/follow-ups`, data);
    return response.data.data;
  },

  completeFollowUp: async (
    leadId: string,
    followUpId: string,
    data: {
      communicationMedium: string;
      discussionNote: string;
      outcome?: string;
      nextFollowUpAt?: string | null;
      stage?: LeadStage;
    }
  ): Promise<FollowUp> => {
    const response = await api.post<ApiResponse<FollowUp>>(
      `/leads/${leadId}/follow-ups/${followUpId}/complete`,
      data
    );
    return response.data.data;
  },

  rescheduleFollowUp: async (
    leadId: string,
    followUpId: string,
    scheduledAt: string
  ): Promise<FollowUp> => {
    const response = await api.patch<ApiResponse<FollowUp>>(
      `/leads/${leadId}/follow-ups/${followUpId}/reschedule`,
      { scheduledAt }
    );
    return response.data.data;
  },

  // Activities API
  getActivities: async (leadId: string, page = 1, limit = 20): Promise<PaginatedResponse<LeadActivity>> => {
    const response = await api.get<ApiResponse<LeadActivity[]>>(`/leads/${leadId}/activities?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination || {
        page,
        limit,
        totalItems: response.data.data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  },
};
