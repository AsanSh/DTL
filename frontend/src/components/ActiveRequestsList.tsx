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
  created_by: number
}

interface ActiveRequestsListProps {
  requests: Request[]
  onRequestClose: (id: number, unloadingDate: string) => void
  onRequestCancel: (id: number) => void
  isAdmin: boolean
}

export const ActiveRequestsList = ({ 
  requests, 
  onRequestClose, 
  onRequestCancel,
  isAdmin 
}: ActiveRequestsListProps) => {
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)
  const [showDateDialog, setShowDateDialog] = useState(false)
  const [unloadingDate, setUnloadingDate] = useState('')
  const navigate = useNavigate()

  const handleCloseClick = (id: number) => {
    setSelectedRequest(id)
    setUnloadingDate('')
    setShowDateDialog(true)
  }

  const handleConfirmClose = () => {
    if (selectedRequest && unloadingDate) {
      onRequestClose(selectedRequest, new Date(unloadingDate).toISOString())
      setShowDateDialog(false)
      setSelectedRequest(null)
      navigate('/closed')
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {showDateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Укажите дату выгрузки</h3>
            <input
              type="date"
              value={unloadingDate}
              onChange={(e) => setUnloadingDate(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDateDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmClose}
                disabled={!unloadingDate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="divide-y">
        {requests.map((request) => (
          <div key={request.id} className="p-4 bg-white">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Заявка #{request.id}</span>
              <span className="text-gray-600">
                {new Date(request.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Логист: {request.logist}</p>
              <p>Водитель: {request.driver_name}</p>
              <p>Груз: {request.cargo_type}</p>
              <p>Маршрут: {request.from_location} → {request.to_location}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleCloseClick(request.id)}
                className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Закрыть
              </button>
              {isAdmin && (
                <button
                  onClick={() => onRequestCancel(request.id)}
                  className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Удалить
                </button>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Нет активных заявок
          </div>
        )}
      </div>
    </div>
  )
} 