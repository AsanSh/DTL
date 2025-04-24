import { WebApp } from '@twa-dev/sdk'
import { useEffect, useState } from 'react'

export const useTelegram = () => {
  const [user, setUser] = useState<{
    username?: string
    id?: number
  }>({})

  useEffect(() => {
    const initData = WebApp.initDataUnsafe
    if (initData?.user) {
      setUser({
        username: initData.user.username,
        id: initData.user.id,
      })
    }
  }, [])

  return {
    WebApp,
    user,
  }
} 