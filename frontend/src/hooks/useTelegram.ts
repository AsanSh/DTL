import { useState, useEffect } from 'react'

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            username?: string;
          };
        };
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          setText: (text: string) => void;
        };
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

export const useTelegram = () => {
  const [user, setUser] = useState<{
    username?: string
    id?: number
  }>({})

  useEffect(() => {
    const twa = window.Telegram.WebApp
    // Initialize WebApp
    twa.ready()
    twa.expand()

    // Get user data from initData
    if (twa.initDataUnsafe?.user) {
      setUser({
        username: twa.initDataUnsafe.user.username,
        id: twa.initDataUnsafe.user.id,
      })
    }

    // Log init data for debugging
    console.log('Telegram WebApp Init Data:', twa.initData)
    console.log('Telegram WebApp User:', twa.initDataUnsafe?.user)
  }, [])

  return {
    user,
    twa: window.Telegram.WebApp,
  }
} 