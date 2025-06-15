export interface ICategory {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  allowedForFree: boolean;
}

export interface ISubscription {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  allowedCategories: string[];
  features: string[];
} 