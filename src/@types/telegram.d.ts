declare global {
  interface Window {
    Telegram?: {
      Login?: {
        auth: (
          container: HTMLElement,
          options: TelegramAuthOptions,
          callback: (user: TelegramUser) => void,
        ) => void;
      };
    };
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface TelegramAuthOptions {
  bot_id: string;
  request_access?: boolean;
  size?: "large" | "medium" | "small";
  corner_radius?: number;
  lang?: string;
}
