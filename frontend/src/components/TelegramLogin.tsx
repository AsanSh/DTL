import React, { useEffect, useRef } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// Создаем свой тип для Telegram API вместо расширения window
export type TelegramUser = {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginProps {
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  botName?: string;
  usePic?: boolean;
  className?: string;
  requestAccess?: boolean;
  lang?: string;
  widgetVersion?: number;
  onAuthCallback?: (user: TelegramUser) => void;
  buttonColor?: string;
}

const TelegramLogin: React.FC<TelegramLoginProps> = ({
  botName = "logistika_bot",  // Используем дефолтное значение
  buttonSize = 'medium',
  cornerRadius = 4,
  usePic = false,
  requestAccess = true,
  lang = 'ru',
  widgetVersion = 23,
  onAuthCallback,
  buttonColor = '#0088cc'
}) => {
  const { telegramAuth } = useAuth();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleTelegramAuth = async (user: TelegramUser) => {
    console.log('Telegram auth callback', user);
    try {
      // Отправляем данные пользователя на бэкенд для регистрации/авторизации
      await telegramAuth({
        telegram_id: user.id,
        username: user.username || `telegram_${user.id}`,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: 'DRIVER', // Дефолтная роль
      });
      
      // Пользовательский callback, если предоставлен
      if (onAuthCallback) {
        onAuthCallback(user);
      }
    } catch (error) {
      console.error('Failed to authenticate with Telegram:', error);
    }
  };

  // Функция для создания скрипта и добавления Telegram Login виджета
  const initTelegramLogin = () => {
    // Проверяем, существует ли уже контейнер виджета и удаляем его, если есть
    const existingContainer = document.getElementById('telegram-login-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    // Создаем контейнер для виджета
    const container = document.createElement('div');
    container.id = 'telegram-login-container';
    container.style.display = 'none';
    document.body.appendChild(container);

    // Создаем скрипт виджета
    const script = document.createElement('script');
    script.src = `https://telegram.org/js/telegram-widget.js?${widgetVersion}`;
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-onauth', 'TelegramLoginCallback(user)');
    script.setAttribute('data-request-access', requestAccess ? 'write' : 'read');
    script.async = true;

    // Добавляем global callback функцию для Telegram виджета
    window.TelegramLoginCallback = handleTelegramAuth;

    scriptRef.current = script;
    container.appendChild(script);
  };

  useEffect(() => {
    // Добавляем глобальную функцию для Telegram Login виджета
    window.TelegramLoginCallback = handleTelegramAuth;
    
    // Инициализируем виджет
    initTelegramLogin();

    return () => {
      // Очистка при размонтировании
      const container = document.getElementById('telegram-login-container');
      if (container) {
        container.remove();
      }
      
      // Удаляем global callback
      if (window.TelegramLoginCallback) {
        // @ts-ignore
        delete window.TelegramLoginCallback;
      }
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, widgetVersion]);

  const handleButtonClick = () => {
    // Вызываем click на скрытой кнопке Telegram Login
    const telegramBtn = document.querySelector('iframe.telegram-login-widget') as HTMLElement;
    if (telegramBtn) {
      telegramBtn.click();
    } else {
      console.error('Telegram Login Widget is not available');
      // Пробуем переинициализировать виджет
      initTelegramLogin();
    }
  };

  return (
    <Box ref={buttonRef}>
      <Button
        variant="contained"
        fullWidth
        onClick={handleButtonClick}
        sx={{
          backgroundColor: buttonColor,
          '&:hover': {
            backgroundColor: '#0077bb',
          },
          borderRadius: `${cornerRadius}px`,
          height: buttonSize === 'large' ? '50px' : buttonSize === 'medium' ? '40px' : '30px'
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {usePic && (
            <img 
              src="https://telegram.org/img/t_logo.png" 
              alt="Telegram Logo" 
              style={{ height: '24px', width: '24px' }}
            />
          )}
          <Typography>
            {lang === 'ru' ? 'Войти через Telegram' : 'Login with Telegram'}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
};

// Добавляем глобальную функцию для Telegram Login виджета
declare global {
  interface Window {
    TelegramLoginCallback: (user: TelegramUser) => void;
  }
}

export default TelegramLogin; 