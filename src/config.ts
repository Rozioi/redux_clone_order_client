export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9090/api/v1';
const config = {
  API_URL,
  AUTH_TOKEN_KEY: 'token',
  USER_DATA_KEY: 'user',
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  getAuthHeader: () => {
    const token = localStorage.getItem(config.AUTH_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  getHeaders: () => {
    const headers: Record<string, string> = {
      ...config.DEFAULT_HEADERS,
    };
    const authHeader = config.getAuthHeader();
    if (authHeader.Authorization) {
      headers.Authorization = authHeader.Authorization;
    }
    return headers;
  },
};

export default config;

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export const SUBSCRIPTION_TYPES = {
  BASIC: 'basic',
  ADVANCED: 'advanced'
} as const;

export const MOD_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const; 