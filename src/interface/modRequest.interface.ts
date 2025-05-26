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