import axios from 'axios';
import config from '../config';
import { IUserWithPermissions } from '../interface/user.interface';
import { IAuthResponse } from '../interface/auth.interface';
import { IMod, IModCreate, IModUpdate, IReview, IReviewCreate, IReviewUpdate, IModRequest } from '../interface/mod.interface';
import { ICategory, ICategoryCreate } from '../interface/category.interface';

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
  // Аутентификация
  static async login(email: string, password: string): Promise<IAuthResponse> {
    const { data } = await api.post<IAuthResponse>('/auth/login', { email, password });
    return data;
  }
  static async updateRatingMod(modId:string, param:string,operation:string): Promise<boolean>{
    const result = await api.post<boolean>('/mods/update_rating', { modId, param,operation });
    return result.data;
  }
  
  static async register(username: string, email: string, password: string): Promise<IAuthResponse> {
    const { data } = await api.post<IAuthResponse>('/auth/register', { username, email, password });
    return data;
  }

  static async getProfile(): Promise<IUserWithPermissions> {
    const { data } = await api.get<IUserWithPermissions>('/users/profile');
    return data;
  }

  static async updateProfile(userData: Partial<IUserWithPermissions>): Promise<IUserWithPermissions> {
    const { data } = await api.patch<IUserWithPermissions>('/users/profile', userData);
    return data;
  }

  // Моды
  static async createModRequest(modRequestData: Omit<IModRequest, '_id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<IModRequest> {
    const { data } = await api.post<IModRequest>('/mods/request', modRequestData);
    return data;
  }

  static async getMods(params?: Record<string, string>): Promise<IMod[]> {
    const { data } = await api.get<IMod[]>('/mods', { params });
    return data;
  }

  static async getModById(id: string): Promise<IMod> {
    const { data } = await api.get<IMod[]>(`/mod/${id}`);
    return data[0];
  }

  static async createMod(modData: IModCreate): Promise<IMod> {
    const { data } = await api.post<IMod>('/mods', modData);
    return data;
  }

  static async updateMod(id: string, modData: IModUpdate): Promise<IMod> {
    const { data } = await api.patch<IMod>(`/mods/${id}`, modData);
    return data;
  }

  static async deleteMod(id: string): Promise<void> {
    await api.delete(`/mods/${id}`);
  }

  // Отзывы
  static async getReviews(modId: string): Promise<IReview[]> {
    const { data } = await api.get<IReview[]>(`/mods/${modId}/reviews`);
    return data;
  }

  static async createReview(modId: string, reviewData: IReviewCreate): Promise<IReview> {
    const { data } = await api.post<IReview>(`/mods/${modId}/reviews`, reviewData);
    return data;
  }

  static async updateReview(modId: string, reviewId: string, reviewData: IReviewUpdate): Promise<IReview> {
    const { data } = await api.patch<IReview>(`/mods/${modId}/reviews/${reviewId}`, reviewData);
    return data;
  }

  static async deleteReview(modId: string, reviewId: string): Promise<void> {
    await api.delete(`/mods/${modId}/reviews/${reviewId}`);
  }

  // Категории
  static async getCategories(): Promise<ICategory[]> {
    const { data } = await api.get<ICategory[]>('/categories');
    return data;
  }

  static async createCategory(categoryData: ICategoryCreate): Promise<ICategory> {
    const { data } = await api.post<ICategory>('/categories', categoryData);
    return data;
  }

  static async updateCategory(id: string, categoryData: Partial<ICategoryCreate>): Promise<ICategory> {
    const { data } = await api.patch<ICategory>(`/categories/${id}`, categoryData);
    return data;
  }
  static async getCategoryById(categoryId:any): Promise<any>{
    const result = await api.get<any>(`/category/${categoryId}`);
    return result.data;
  }

  static async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
}

export default ApiService; 