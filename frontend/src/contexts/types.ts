// Типы для контекста авторизации
export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  telegramAuth: (telegramData: any) => Promise<void>;
} 