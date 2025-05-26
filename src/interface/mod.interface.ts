import { MOD_STATUS } from '../config';
import { ICategory } from './category.interface';
import { IUser, IUserWithPermissions } from './user.interface';

export type ModStatus = typeof MOD_STATUS[keyof typeof MOD_STATUS];

export interface IModCard {
  _id: string;
  modName: string;
  description: string;
  previewLink: string;
  fileLink: string;
  youtubeLink?: string; 
  categories?: Array<{ 
    _id: string;
    name: string;
  }>;
  rating: {
    like: number;
    dislike: number;
    downloads: number;
  };
  size: string;
  isVisibleDiscord: boolean;
  discord: string;
  archivePassword?: string;
  createdAt?: Date | string;
}

export interface IModRequest {
  _id: string;
  userId: string;
  categoryId: string;
  modName: string;
  description: string;
  fileUrl: string;
  discord: string;
  youtubeLink?: string;
  previewLink?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface IModRequestWithDetails extends Omit<IModRequest, 'fileUrl'> {
  fileUrl?: string;
  category?: ICategory;
  user?: IUser;
  rating?: number;
  size?: number;
  isVisibleDiscord?: boolean;
}

export interface IReview {
  _id: string;
  modId: string;
  userId: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: IUserWithPermissions;
}

export interface IMod {
  _id: string;
  modName: string;
  description: string;
  previewLink: string;
  fileLink: string;
  fileUrl?: string;
  isLocalState: boolean;
  localPreviewPath: string;
  localFilePath: string;
  youtubeLink?: string; 
  categories?: Array<{ 
    _id: string;
    name: string;
  }>;
  rating: {
    like: number;
    dislike: number;
    downloads: number;
  };
  size: string;
  isVisibleDiscord: boolean;
  discord: string;
  archivePassword?: string;
  createdAt: string;
  is_moderated: boolean;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  reviews: IReview[];
  author: IUserWithPermissions;
  tags: string[];
  version: string;
}

export interface IModCreate {
  modName: string;
  description: string;
  version: string;
  categoryIds: string[];
  tags: string[];
  previewLink?: string;
  fileLink?: string;
  youtubeLink?: string;
  discord: string;
  isVisibleDiscord: boolean;
  archivePassword?: string;
}

export interface IModUpdate extends Partial<IModCreate> {}

export interface IReviewCreate {
  rating: number;
  text: string;
}

export interface IReviewUpdate extends Partial<IReviewCreate> {}