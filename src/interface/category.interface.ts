import { SUBSCRIPTION_TYPES } from '../config';

export type SubscriptionType = typeof SUBSCRIPTION_TYPES[keyof typeof SUBSCRIPTION_TYPES];

export interface ICategory {
  _id?: string;
  name: string;
  parentId: string ;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  requiresSubscription?: boolean;
  subscriptionId?: string;
}

export interface IModerator {
  _id: string;
  name: string;
  email: string;
}

export interface ICategoryWithModerators extends Omit<ICategory, 'moderators'> {
  moderators: IModerator[];
}

export interface ICategoryCreate {
  name: string;
  description?: string;
}

export interface ICategoryUpdate {
  name?: string;
  description?: string;
} 