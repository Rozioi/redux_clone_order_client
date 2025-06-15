export interface ISubscription {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; 
  level: 'basic' | 'medium' | 'premium';
  logo: string;
  features: string[];
  allowedCategories: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserSubscription {
  _id: string;
  userId: string;
  subscriptionId: string;
  subscription: ISubscription;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubscriptionFormData {
  name: string;
  description: string;
  price: number;
  duration: number; 
  level: 'basic' | 'medium' | 'premium';
  logo: string;
  features: string[];
  allowedCategories: string[];
  isActive: boolean;
} 