// Этот файл создан для обновления кеша TypeScript и решения проблемы с типизацией
// telegramAuth в AuthContextType
import { AuthContextType } from './contexts/types';
import { TelegramUser } from './components/TelegramLogin';

declare global {
  interface Window {
    TelegramLoginCallback: (user: TelegramUser) => void;
  }
}

export {}; 