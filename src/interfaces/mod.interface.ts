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
      downloads?: number; 
    }
  }