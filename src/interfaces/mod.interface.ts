export interface IModCard {
  _id: string;
  modName: string;
  description: string;
  previewLink: string;
  fileLink: string;
  youtubeLink?: string; 
  categories?: string[];
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