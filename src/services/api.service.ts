import axios from 'axios';
import config from '../config';
import { IUser, IUserWithPermissions, IUserStats } from '../interface/user.interface';
import { IAuthResponse } from '../interface/auth.interface';
import { IMod, IModCreate, IModUpdate, IReview, IReviewCreate, IReviewUpdate, IModRequest, ICommentsRequest, ModStatus } from '../interface/mod.interface';
import { ICategory, ICategoryCreate } from '../interface/category.interface';
import { IComments } from '../components/mod/ModCard';
import { ISubscriptionFormData, IUserSubscription } from '../interfaces/subscription.interface';

export interface Payment {
    id: string;
    amount: string;
    created_at: string;
    description: string;
    expires_at: string;
    captured_at: string;
    metadata: any;
 
    confirmation: {
      confirmation_url: string
    };
}

type PaymentResponse = {
  payment: Payment;
  index: number;
};

export interface IUserBadgeResponse {
  userID: string;   
  badge: string;      
  badgeType: 'role' | 'status' | 'custom'; 
  cssClass?: string; 
}
export type UserRole = 'user' | 'moderator' | 'admin';
export interface IUserBadge {
  _id: string;     
  userID: string;   
  badge: string;      
  badgeType: 'role' | 'status' | 'custom'; 
  cssClass?: string; 
  isActive?: boolean; 
  assignedAt: Date; 
}
export interface ISubscription {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // в днях
  level: 'basic' | 'medium' | 'premium';
  logo: string;
  features: string[];
  allowedCategories: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdvertisement {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  clicks: number;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ApiService {
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  // Аутентификация
  static async login(email: string, password: string): Promise<IAuthResponse> {
    const { data } = await api.post<IAuthResponse>('/auth/login', { email, password });
    return data;
  }

  static async register(username: string, email: string, password: string): Promise<IAuthResponse> {
    const { data } = await api.post<IAuthResponse>('/auth/register', { username, email, password });
    return data;
  }

  // Профиль
  static async getProfile(): Promise<IUserWithPermissions> {
    const { data } = await api.get<IUserWithPermissions>('/users/profile');
    return data;
  }

  static async updateProfile(userData: Partial<IUserWithPermissions>): Promise<IUserWithPermissions> {
    const { data } = await api.patch<IUserWithPermissions>('/users/profile', userData);
    return data;
  }

  // Категории
  static async getCategories(): Promise<ICategory[]> {
    const { data } = await api.get<{ data: ICategory[] }>('/categories');
    return data.data;
  }

  static async createCategory(categoryData: ICategoryCreate): Promise<ICategory> {
    const { data } = await api.post<{ data: ICategory }>('/categories', categoryData);
    return data.data;
  }

  static async updateCategory(id: string, categoryData: Partial<ICategoryCreate>): Promise<ICategory> {
    const { data } = await api.put<{ data: ICategory }>(`/categories/${id}`, categoryData);
    return data.data;
  }

  static async getCategoryById(categoryId: string): Promise<ICategory> {
    const { data } = await api.get<ICategory>(`/category/${categoryId}`);
    return data;
  }

  static async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }

  // Реклама
  static async getAdvertisements(): Promise<IAdvertisement[]> {
    const { data } = await api.get<{ data: IAdvertisement[] }>('/advertisements');
    return data.data;
  }

  static async getAdvertisementsForAdmin(): Promise<IAdvertisement[]> {
    const { data } = await api.get<{ data: IAdvertisement[] }>('/admin/advertisements');
    return data.data;
  }

  static async createAdvertisement(data: Omit<IAdvertisement, '_id'>): Promise<IAdvertisement> {
    const response = await api.post<{ data: IAdvertisement }>('/advertisements', data);
    return response.data.data;
  }

  static async updateAdvertisement(id: string, data: Partial<IAdvertisement>): Promise<IAdvertisement> {
    const response = await api.put<{ data: IAdvertisement }>(`/advertisements/${id}`, data);
    return response.data.data;
  }

  static async incrementClicks(id: string): Promise<void> {
    await api.post(`/advertisements/${id}/clicks`);
  }

  static async deleteAdvertisement(id: string): Promise<void> {
    await api.delete(`/advertisements/${id}`);
  }

  // Сообщения
  static async getMessages(userId: string): Promise<any[]> {
    const { data } = await api.get<{ data: any[] }>(`/messages/${userId}`);
    return data.data;
  }

  static async markMessageAsRead(messageId: string): Promise<void> {
    await api.put(`/messages/${messageId}/read`);
  }

  static async createMessage(messageData: any): Promise<any> {
    const { data } = await api.post<{ data: any }>('/messages', messageData);
    return data.data;
  }

  // Моды
  static async getAllMods(): Promise<IMod[]> {
    const { data } = await api.get<IMod[]>('/mods/all');
    return data;
  }

  static async getModsForUser(): Promise<IMod[]> {
    const { data } = await api.get<IMod[]>('/mods');
    return data;
  }

  static async searchMods(query: string): Promise<IMod[]> {
    const { data } = await api.get<IMod[]>('/mods/search', { params: { query } });
    return data;
  }

  static async getModsByStatus(status: ModStatus): Promise<IMod[]> {
    const { data } = await api.get<IMod[]>(`/mods/status/${status}`);
    return data;
  }

  static async createComment(commentData: any): Promise<any> {
    const { data } = await api.post<{ data: any }>('/comment', commentData);
    return data.data;
  }

  static async getCommentsByModId(modId: string): Promise<any[]> {
    const { data } = await api.get<any[]>(`/comments/${modId}`);
    return data;
  }

  static async deleteComment(modId: string): Promise<void> {
    await api.delete(`/comment/${modId}`);
  }

  static async getModById(id: string): Promise<IMod> {
    const { data } = await api.get<IMod[]>(`/mod/${id}`);
    return data[0];
  }

  static async deleteMod(userId: string, modId: string): Promise<void> {
    await api.delete(`/mods/delete/${userId}/${modId}`);
  }

  // Пользователи
  static async getUserById(id: string): Promise<IUser> {
    const { data } = await api.get<IUser>(`/users/${id}`);
    return data;
  }

  static async searchUser(identifier: string): Promise<IUser> {
    const { data } = await api.get<IUser>(`/users/search/${identifier}`);
    return data;
  }

  static async downloadMod(file: string, speed: number): Promise<Blob> {
    const response = await api.get(`/download/${file}`, { 
      responseType: 'blob',
      params: {
        speed: speed
      }
    });
    return response.data;
  }

  static async downloadModFromDrive(url: string, modId: string): Promise<any> {
    const { data } = await api.post<{ data: any }>('/mods/download', { url, modId });
    return data.data;
  }

  static async getUsers(page: number = 1, limit: number = 10): Promise<any> {
    const { data } = await api.get<{ data: any }>('/users', { params: { page, limit } });
    return data.data;
  }

  static async getUserBadge(userId: string): Promise<any> {
    const { data } = await api.get<{ data: any }>(`/badge/${userId}`);
    return data.data;
  }

  static async getAllBadges(): Promise<any[]> {
    const { data } = await api.get<{ data: any[] }>('/badges');
    return data.data;
  }

  static async deleteUserBadge(userId: string): Promise<void> {
    await api.delete(`/badge/${userId}`);
  }

  static async toggleUserStatus(id: string): Promise<void> {
    await api.put(`/users/${id}/status`);
  }

  static async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  static async verifyAdmin(): Promise<any> {
    const { data } = await api.post<{ data: any }>('/admin/verify');
    return data.data;
  }

  static async verifyToken(): Promise<any> {
    const { data } = await api.get<{ data: any }>('/users/verify');
    return data.data;
  }

  // Подписки
  static async getSubscriptions(): Promise<ISubscription[]> {
    const { data } = await api.get<ISubscription[] >('/subscriptions');
    return data;
  }
  static async getUserSubscriptions(userId: string): Promise<IUserSubscription[]> {
    const { data } = await api.get<IUserSubscription[]>(`/user-subscriptions/${userId}`);
    return data;
  }

  static async createSubscription(data: ISubscriptionFormData): Promise<ISubscription> {
    const { data: response } = await api.post<{ data: ISubscription }>('/subscriptions', data);
    return response.data;
  }

  static async createPayment(value: string, userId: string, subscriptionId: string): Promise<PaymentResponse> {
    const { data } = await api.post<PaymentResponse>('/payment', { value, userId, subscriptionId });
    return data;
  }

  static async updateSubscription(id: string, subscriptionData: Partial<ISubscription>): Promise<ISubscription> {
    const { data } = await api.put<{ data: ISubscription }>(`/subscriptions/${id}`, subscriptionData);
    return data.data;
  }

  static async updateSubscriptionStatus(id: string, isActive: boolean): Promise<void> {
    await api.patch(`/subscriptions/${id}`, { isActive });
  }

  static async deleteSubscription(id: string): Promise<void> {
    await api.delete(`/subscriptions/${id}`);
  }

  // Пользователи
  static async getAllUsers(): Promise<IUserWithPermissions[]> {
    const { data } = await api.get<IUserWithPermissions[] >('/admin/users');
    return data;
  }

  static async getUserStatsById(userId: string): Promise<IUserStats> {
    const { data } = await api.get<{ data: IUserStats }>(`/users/stats/${userId}`);
    return data.data;
  }

  static async getUserByUsernameOrId(identifier: string): Promise<IUser> {
    const { data } = await api.get<IUser>(`/users/search/${identifier}`);
    return data;
  }

  static async getModsByUserId(userId: string): Promise<IMod[]> {
    const { data } = await api.get<IMod[]>(`/users/${userId}/mods`);
    return data;
  }

  static async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    await api.patch(`/admin/users/${userId}/role`, { role: newRole });
  }

  static async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    await api.patch(`/admin/users/${userId}/status`, { isActive });
  }

  // Моды
  static async updateMod(id: string, modData: IModUpdate): Promise<IMod> {
    const { data } = await api.patch<{ data: IMod }>(`/mods/${id}`, modData);
    return data.data;
  }

  static async approveMod(modId: string): Promise<{ message: string }> {
    const { data } = await api.patch<{ message: string }>(`/admin/mods/${modId}/approve`);
    return data;
  }

  static async rejectMod(modId: string): Promise<{ message: string }> {
    const { data } = await api.patch<{ message: string }>(`/admin/mods/${modId}/reject`);
    return data;
  }

  static async createModRequest(modRequestData: Omit<IModRequest, '_id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<IModRequest> {
    const { data } = await api.post<{ data: IModRequest }>('/mods/request', modRequestData);
    return data.data;
  }

  // Бейджи
  static async giveBadge(userData: IUserBadgeResponse): Promise<string> {
    const { data } = await api.post<string>('/admin/badge', userData);
    return data;
  }

  static async getBadges(): Promise<IUserBadge[]> {
    const { data } = await api.get<IUserBadge[]>('/badges');
    return data;
  }

  static async removeBadge(userId: string): Promise<string> {
    const { data } = await api.delete<string>(`/badge/${userId}`);
    return data;
  }

  static async getBadgeByUserId(userId: string): Promise<IUserBadge> {
    const { data } = await api.get<IUserBadge>(`/badge/${userId}`);
    return data;
  }

  // Комментарии
  static async CreateComment(data: ICommentsRequest): Promise<string> {
    const { data: response } = await api.post<string>('/comment', data);
    return response;
  }

  static async GetCommentsByModId(modId: string): Promise<IComments[]> {
    const { data } = await api.get<IComments[]>(`/comments/${modId}`);
    return data;
  }

  static async updateRatingMod(modId: string, param: string, operation: string): Promise<boolean> {
    const { data } = await api.post<boolean>('/mods/update_rating', { modId, param, operation });
    return data;
  }

  // Моды
  static async createMod(modData: IModCreate): Promise<{ message: string; id: string }> {
    const { data } = await api.post<{ message: string; id: string }>('/mods', modData);
    return data;
  }

  static async checkAndUpdatePayment(userId: string): Promise<{success:boolean, payment: any}> {
      const {data} = await api.post('/payment/check', {
        userId
      });
      return data;
  }

  static async getSubscriptionSettings() {
    try {
      const { data } = await api.get('/subscription/settings');
      return data;
    } catch (error) {
      console.error('Error fetching subscription settings:', error);
      throw error;
    }
  }

  static async deactivateSubscription(userId: string, subscriptionId: string): Promise<{ success: boolean }> {
    try {
      const {data} = await api.post(`/user-subscriptions/${userId}/${subscriptionId}/cancel`);
      return data;
    } catch (error) {
      console.error('Error deactivating subscription:', error);
      throw error;
    }
  }

  async getMods() {
    try {
      const response = await axios.get(`${this.API_URL}/mods`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mods:', error);
      throw error;
    }
  }

}

export default ApiService;