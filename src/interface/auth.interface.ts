import { IUser, IUserWithPermissions } from './user.interface';

export interface IAuthResponse {
  status: 'success' | 'verification_required';
  token: string;
  user: IUserWithPermissions;
  email?: string;
  isAdmin?: boolean;
  message?: string;
}


export interface IAuthError {
  message: string;
  code?: string;
  status?: number;
} 