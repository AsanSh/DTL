import React, { createContext, useContext, useState, useEffect } from 'react'

// Ключи для localStorage
const STORAGE_KEYS = {
  REQUESTS: 'dtl_requests',
  CURRENT_USER: 'dtl_current_user',
  PENDING_USERS: 'dtl_pending_users'
}

interface User {
  id: number
  username: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager'
  status: 'pending' | 'approved' | 'rejected'
  registrationDate: string
}

interface Request {
  id: number
  created_at: string
  created_by: number
  logist: string
  driver_name: string
  cargo_type: string
  from_location: string
  to_location: string
  status: 'active' | 'closed'
  our_price: string
  driver_price: string
  tax: string
  office_commission: string
  unloading_date?: string
}

interface RequestContextType {
  requests: Request[]
  currentUser: User | null
  pendingUsers: User[]
  isAdmin: () => boolean
  getVisibleRequests: () => Request[]
  addRequest: (request: Omit<Request, 'id' | 'created_at' | 'created_by' | 'status'>) => void
  closeRequest: (id: number) => void
  cancelRequest: (id: number) => void
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: Omit<User, 'id' | 'role' | 'status' | 'registrationDate'>) => Promise<void>
  approveUser: (userId: number) => void
  rejectUser: (userId: number) => void
  exportToGoogleSheets: () => Promise<string>
}

const RequestContext = createContext<RequestContextType | undefined>(undefined)

export function useRequests() {
  const context = useContext(RequestContext)
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider')
  }
  return context
}

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Инициализируем состояния из localStorage
  const [requests, setRequests] = useState<Request[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS)
      console.log('Загруженные заявки из localStorage:', saved)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error)
      return []
    }
  })

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      console.log('Загруженный пользователь из localStorage:', saved)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Ошибка при загрузке текущего пользователя:', error)
      return null
    }
  })

  const [pendingUsers, setPendingUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PENDING_USERS)
      console.log('Загруженные ожидающие пользователи из localStorage:', saved)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Ошибка при загрузке ожидающих пользователей:', error)
      return []
    }
  })

  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
      console.log('Сохранены заявки:', requests)
    } catch (error) {
      console.error('Ошибка при сохранении заявок:', error)
    }
  }, [requests])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser))
      console.log('Сохранен текущий пользователь:', currentUser)
    } catch (error) {
      console.error('Ошибка при сохранении текущего пользователя:', error)
    }
  }, [currentUser])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PENDING_USERS, JSON.stringify(pendingUsers))
      console.log('Сохранены пользователи:', pendingUsers)
    } catch (error) {
      console.error('Ошибка при сохранении пользователей:', error)
    }
  }, [pendingUsers])

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    try {
      const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS)
      if (savedRequests) {
        setRequests(JSON.parse(savedRequests))
        console.log('Загружены заявки:', JSON.parse(savedRequests))
      }

      const savedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      if (savedCurrentUser) {
        setCurrentUser(JSON.parse(savedCurrentUser))
        console.log('Загружен текущий пользователь:', JSON.parse(savedCurrentUser))
      }

      const savedPendingUsers = localStorage.getItem(STORAGE_KEYS.PENDING_USERS)
      if (savedPendingUsers) {
        setPendingUsers(JSON.parse(savedPendingUsers))
        console.log('Загружены пользователи:', JSON.parse(savedPendingUsers))
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных из localStorage:', error)
    }
  }, [])

  // Имитация загрузки данных
  useEffect(() => {
    // Инициализация администратора при первом запуске
    const adminUser: User = {
      id: 1,
      username: 'admin',
      name: 'Администратор',
      email: 'admin@example.com',
      phone: '+996700000000',
      role: 'admin',
      status: 'approved',
      registrationDate: '2024-01-01T00:00:00'
    }

    // Проверяем, есть ли уже пользователи
    if (pendingUsers.length === 0) {
      console.log('Инициализация администратора:', adminUser)
      setPendingUsers([adminUser])
    }

    // Загружаем тестовые заявки, если их нет
    if (requests.length === 0) {
      const mockRequests: Request[] = [
        {
          id: 1,
          created_at: '2024-01-20T10:00:00',
          created_by: 1,
          logist: 'Иван',
          driver_name: 'Петр',
          cargo_type: 'Электроника',
          from_location: 'Бишкек',
          to_location: 'Ош',
          status: 'active',
          our_price: '50000',
          driver_price: '40000',
          tax: '5000',
          office_commission: '2000'
        }
      ]
      setRequests(mockRequests)
    }
  }, [])

  const isAdmin = () => currentUser?.role === 'admin'

  const getVisibleRequests = () => {
    if (!currentUser) return []
    if (isAdmin()) return requests
    return requests.filter(r => r.created_by === currentUser.id)
  }

  const addRequest = (requestData: Omit<Request, 'id' | 'created_at' | 'created_by' | 'status'>) => {
    if (!currentUser) return

    const newRequest: Request = {
      ...requestData,
      id: Math.max(0, ...requests.map(r => r.id)) + 1,
      created_at: new Date().toISOString(),
      created_by: currentUser.id,
      status: 'active'
    }

    setRequests(prev => [...prev, newRequest])
  }

  const closeRequest = (id: number) => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'closed', unloading_date: new Date().toISOString() } : r
    ))
  }

  const cancelRequest = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  const login = async (username: string, password: string) => {
    // Здесь будет реальная аутентификация
    if (username === 'admin' && password === '12345') {
      setCurrentUser({
        id: 1,
        username: 'admin',
        name: 'Администратор',
        email: 'admin@example.com',
        phone: '+996700000000',
        role: 'admin',
        status: 'approved',
        registrationDate: '2024-01-01T00:00:00'
      })
      return
    }

    const user = pendingUsers.find(u => u.username === username)
    if (user) {
      if (user.status === 'pending') {
        throw new Error('Ваша заявка на регистрацию еще не одобрена')
      }
      if (user.status === 'rejected') {
        throw new Error('Ваша заявка на регистрацию была отклонена')
      }
      if (password === username) { // В реальном приложении здесь будет проверка хеша пароля
        setCurrentUser(user)
        return
      }
    }

    throw new Error('Неверное имя пользователя или пароль')
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const register = async (userData: Omit<User, 'id' | 'role' | 'status' | 'registrationDate'>) => {
    console.log('Начало регистрации пользователя:', userData)
    
    const existingUser = pendingUsers.find(u => u.username === userData.username || u.email === userData.email)
    if (existingUser) {
      console.log('Найден существующий пользователь:', existingUser)
      throw new Error('Пользователь с таким именем или email уже существует')
    }

    const newUser: User = {
      ...userData,
      id: Math.max(0, ...pendingUsers.map(u => u.id), 1) + 1,
      role: 'manager',
      status: 'pending',
      registrationDate: new Date().toISOString()
    }

    console.log('Создан новый пользователь:', newUser)
    console.log('Текущие пользователи перед добавлением:', pendingUsers)

    setPendingUsers(prev => {
      const updated = [...prev, newUser]
      console.log('Обновленный список пользователей:', updated)
      return updated
    })
  }

  const approveUser = (userId: number) => {
    console.log('Одобрение пользователя:', userId)
    console.log('Текущие пользователи перед одобрением:', pendingUsers)
    
    setPendingUsers(prev => {
      const updated = prev.map(u => 
        u.id === userId ? { ...u, status: 'approved' as const } : u
      )
      console.log('Обновленный список после одобрения:', updated)
      return updated
    })
  }

  const rejectUser = (userId: number) => {
    console.log('Отклонение пользователя:', userId)
    console.log('Текущие пользователи перед отклонением:', pendingUsers)
    
    setPendingUsers(prev => {
      const updated = prev.map(u => 
        u.id === userId ? { ...u, status: 'rejected' as const } : u
      )
      console.log('Обновленный список после отклонения:', updated)
      return updated
    })
  }

  const exportToGoogleSheets = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const data = await response.json();
      return data.spreadsheetUrl;
    } catch (error) {
      console.error('Error exporting to Google Sheets:', error);
      throw error;
    }
  };

  const contextValue: RequestContextType = {
    requests,
    currentUser,
    pendingUsers,
    isAdmin,
    getVisibleRequests,
    addRequest,
    closeRequest,
    cancelRequest,
    login,
    logout,
    register,
    approveUser,
    rejectUser,
    exportToGoogleSheets
  }

  return (
    <RequestContext.Provider value={contextValue}>
      {children}
    </RequestContext.Provider>
  )
} 