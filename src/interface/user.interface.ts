import { ROLES } from '../config';

export type UserRole = typeof ROLES[keyof typeof ROLES];

export interface IUserPermissions {
  role: UserRole;
  isActive: boolean;
  isAdmin: boolean;
  canManageUsers: boolean;
  canManageCategories: boolean;
  canModerateMods: boolean;
  assignedCategories: string[];
}

export interface IUser {
  _id: string;
  username: string;
  password_hash: string;
  email: string;
  isActive: boolean;
  role: 'user' | 'admin';
  last_login: Date | null;
  createdAt: Date;
}

export interface IUserProfile {
  _id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  modsCount: number;
  reviewsCount: number;
  avatarUrl: string;
}
export interface IUserWithPermissions extends Omit<IUser, 'password_hash' | '_id'> {
  _id: string;        
  role: 'user' | 'admin';
}