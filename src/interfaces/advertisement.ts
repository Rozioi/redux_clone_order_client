export interface IAdvertisement {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  clicks: number;
  isActive: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdvertisementResponse {
  success: boolean;
  message: string;
  data?: IAdvertisement[];
} 