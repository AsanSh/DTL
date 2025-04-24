import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Request {
  id: number
  created_at: string
  logist: string
  driver_name: string
  cargo_type: string
  from_location: string
  to_location: string
  status: 'active' | 'closed'
}

interface ActiveRequestsListProps {
  requests: Request[]
  onRequestClose: (id: number, unloadingDate: string) => void
  onRequestCancel: (id: number) => void
}

export const ActiveRequestsList = ({ requests, onRequestClose, onRequestCancel }: ActiveRequestsListProps) => {
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)
  const [unloadingDate, setUnloadingDate] = useState('')
  const navigate = useNavigate()

  const handleRequestClick = (id: number) => {
    setSelectedRequest(id)
    setUnloadingDate('')
  }

  const handleConfirm = () => {
    if (unloadingDate && selectedRequest) {
      onRequestClose(selectedRequest, unloadingDate)
      navigate('/closed')
    }
  }

  const handleCancel = () => {
    if (selectedRequest) {
      onRequestCancel(selectedRequest)
      setSelectedRequest(null)
    }
  }

  return (
    <div className="bg-white shadow-sm flex-1 overflow-y-auto">
      {selectedRequest ? (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Укажите дату выгрузки</h3>
          <input
            type="date"
            value={unloadingDate}
            onChange={(e) => setUnloadingDate(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              disabled={!unloadingDate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Закрыть заявку
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Отменить заявку
            </button>
            <button
              onClick={() => setSelectedRequest(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Назад
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRequestClick(request.id)}
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Заявка #{request.id}</span>
                <span className="text-gray-600">{new Date(request.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Логист: {request.logist}</p>
                <p>Водитель: {request.driver_name}</p>
                <p>Груз: {request.cargo_type}</p>
                <p>Маршрут: {request.from_location} → {request.to_location}</p>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Нет активных заявок
            </div>
          )}
        </div>
      )}
    </div>
  )
} 