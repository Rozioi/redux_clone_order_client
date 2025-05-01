export interface IModCard {
    mod: {
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
      discord:string;
      createdAt?: Date | string;
    }
  }