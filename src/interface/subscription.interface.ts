export interface IPublicSubscription {
  id: string;
  name: string;
  description: string;
  price: number;
  level: 'basic' | 'medium' | 'premium';
  logo: string;
  features: string[];
  durationDays: number;
  allowedCategories: string[];
  isActive: boolean;
}

export interface IUserSubscription {
  id: string;
  userId: string;
  subscriptionId: string;
  subscription: IPublicSubscription;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserSubscriptionRequest {
  userId: string;
  subscriptionId: string;
  durationDays?: number;
}

export interface ISubscription {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  logo: string;
  level: 'basic' | 'medium' | 'premium';
  allowedCategories: string[];
  downloadQuota: {
    basic: number;    // МБ/с для базовой подписки
    medium: number;   // МБ/с для средней подписки
    premium: number;  // МБ/с для премиум подписки
    free: number;     // МБ/с для пользователей без подписки
  };
  createdAt: Date;
  updatedAt: Date;
} 