import { useRequests } from '../context/RequestContext'

export const Closed = () => {
  const { requests } = useRequests()
  const closedRequests = requests.filter(r => r.status === 'closed')

  return (
    <div className="flex flex-col h-screen pb-16">
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Закрытые заявки</h1>
      </div>
      <div className="bg-white shadow-sm flex-1 overflow-y-auto">
        <div className="divide-y">
          {closedRequests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Заявка #{request.id}</span>
                <span className="text-gray-600">{new Date(request.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Логист: {request.logist}</p>
                <p>Водитель: {request.driver_name}</p>
                <p>Груз: {request.cargo_type}</p>
                <p>Маршрут: {request.from_location} → {request.to_location}</p>
                <p>Дата закрытия: {new Date(request.unloading_date || '').toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {closedRequests.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Нет закрытых заявок
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 