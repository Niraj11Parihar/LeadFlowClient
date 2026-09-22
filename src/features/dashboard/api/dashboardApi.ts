import api from '../../../api/axios';
import type { ApiResponse, DashboardStats } from '../../../types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard');
    return response.data.data;
  },
};
