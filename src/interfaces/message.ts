export interface IMessage {
  id: string;
  userId: string;
  modId: string;
  type: 'rejection' | 'approval';
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface IMessageResponse {
  success: boolean;
  message: string;
  data?: IMessage[];
} 