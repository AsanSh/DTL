// Этот файл создан для обновления кеша TypeScript и решения проблемы с типизацией
// telegramAuth в AuthContextType
import { AuthContextType } from './contexts/types';

declare global {
  interface Window {
    TelegramLoginCallback: (user: any) => void;
  }
}

export {}; 