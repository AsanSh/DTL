import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface Request {
  id: number
  created_at: string
  closing_date: string
  shipping_date: string
  logist: string
  driver_name: string
  phone: string
  cargo_type: string
  vehicle_number: string
  from_location: string
  to_location: string
  our_price: string
  driver_price: string
  tax: string
  office_commission: string
  status: 'active' | 'closed'
  unloading_date?: string
}

interface RequestContextType {
  requests: Request[]
  addRequest: (request: Request) => void
  closeRequest: (id: number, unloadingDate: string) => void
  cancelRequest: (id: number) => void
  syncWithBackend: () => Promise<void>
}

const RequestContext = createContext<RequestContextType | undefined>(undefined)

const STORAGE_KEY = 'dtl_requests'
const API_URL = 'http://localhost:3000/api' // Будем использовать позже для бэкенда

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<Request[]>(() => {
    const savedRequests = localStorage.getItem(STORAGE_KEY)
    return savedRequests ? JSON.parse(savedRequests) : []
  })

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  }, [requests])

  const addRequest = (request: Request) => {
    setRequests(prev => {
      const newRequest = { ...request, status: 'active' as const }
      return [...prev, newRequest]
    })
  }

  const closeRequest = (id: number, unloadingDate: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status: 'closed', unloading_date: unloadingDate }
          : request
      )
    )
  }

  const cancelRequest = (id: number) => {
    setRequests(prev => prev.filter(request => request.id !== id))
  }

  // Подготовка для будущей интеграции с бэкендом
  const syncWithBackend = async () => {
    try {
      // TODO: Implement backend sync
      // const response = await fetch(`${API_URL}/requests`)
      // const data = await response.json()
      // setRequests(data)
    } catch (error) {
      console.error('Failed to sync with backend:', error)
    }
  }

  return (
    <RequestContext.Provider value={{ requests, addRequest, closeRequest, cancelRequest, syncWithBackend }}>
      {children}
    </RequestContext.Provider>
  )
}

export const useRequests = () => {
  const context = useContext(RequestContext)
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider')
  }
  return context
} 