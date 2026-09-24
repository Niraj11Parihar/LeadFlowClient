import api from '../../../api/axios';
import type { ApiResponse, User } from '../../../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return response.data.data;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, password });
    return response.data.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  updateProfile: async (name: string): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', { name });
    return response.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put<ApiResponse<null>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return { success: response.data.success, message: response.data.message || 'Password changed successfully' };
  },
};
