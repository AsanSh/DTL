import { useRequests } from '../context/RequestContext'

interface ManagerStats {
  count: number
  revenue: number
  expenses: number
  profit: number
}

interface Summary {
  byManager: {
    [key: string]: ManagerStats
  }
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
}

export const Closed = () => {
  const { getVisibleRequests, currentUser, isAdmin } = useRequests()
  const allRequests = getVisibleRequests()
  const closedRequests = allRequests.filter(r => r.status === 'closed')
  const isAdminUser = isAdmin()

  // Вычисляем сводную информацию
  const summary = closedRequests.reduce<Summary>((acc, request) => {
    const ourPrice = parseFloat(request.our_price || '0')
    const driverPrice = parseFloat(request.driver_price || '0')
    const tax = parseFloat(request.tax || '0')
    const officeCommission = parseFloat(request.office_commission || '0')
    const profit = ourPrice - driverPrice - tax - officeCommission
    
    // Группируем по менеджерам
    const managerKey = request.created_by.toString()
    if (!acc.byManager[managerKey]) {
      acc.byManager[managerKey] = {
        count: 0,
        revenue: 0,
        expenses: 0,
        profit: 0
      }
    }

    acc.byManager[managerKey].count++
    acc.byManager[managerKey].revenue += ourPrice
    acc.byManager[managerKey].expenses += driverPrice + tax + officeCommission
    acc.byManager[managerKey].profit += profit

    // Общая статистика
    acc.totalRevenue += ourPrice
    acc.totalExpenses += driverPrice + tax + officeCommission
    acc.totalProfit += profit

    return acc
  }, {
    byManager: {},
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0
  })

  return (
    <div className="flex flex-col h-screen pb-16">
      <div className="bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Закрытые заявки</h1>
            <p className="text-sm text-gray-600">
              {currentUser?.name} - {isAdminUser ? 'Администратор' : 'Менеджер'}
            </p>
          </div>
        </div>
      </div>

      {isAdminUser && (
        <div className="bg-white mt-2 p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Сводная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600">Общая выручка</p>
              <p className="text-xl font-bold">{Math.round(summary.totalRevenue)} сом</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-600">Общие расходы</p>
              <p className="text-xl font-bold">{Math.round(summary.totalExpenses)} сом</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600">Общая прибыль</p>
              <p className="text-xl font-bold">{Math.round(summary.totalProfit)} сом</p>
            </div>
          </div>

          <h3 className="text-md font-semibold mb-2">По менеджерам:</h3>
          <div className="space-y-3">
            {Object.entries(summary.byManager).map(([manager, stats]) => (
              <div key={manager} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Менеджер ID: {manager}</p>
                  <p className="text-sm text-gray-600">Заявок: {stats.count}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-blue-600">Выручка</p>
                    <p className="font-medium">{Math.round(stats.revenue)} сом</p>
                  </div>
                  <div>
                    <p className="text-red-600">Расходы</p>
                    <p className="font-medium">{Math.round(stats.expenses)} сом</p>
                  </div>
                  <div>
                    <p className="text-green-600">Прибыль</p>
                    <p className="font-medium">{Math.round(stats.profit)} сом</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm flex-1 overflow-y-auto mt-2">
        <div className="divide-y">
          {closedRequests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Заявка #{request.id}</span>
                <span className="text-gray-600">{new Date(request.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-gray-600">
                <div className="grid grid-cols-2 gap-2">
                  <p>Логист: {request.logist}</p>
                  <p>Водитель: {request.driver_name}</p>
                  <p>Груз: {request.cargo_type}</p>
                  <p>Маршрут: {request.from_location} → {request.to_location}</p>
                  <p>Дата закрытия: {request.unloading_date ? new Date(request.unloading_date).toLocaleDateString() : '-'}</p>
                </div>
                {isAdminUser && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold mb-2">Финансы:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-blue-600">Наша цена:</p>
                        <p className="font-medium">{request.our_price} сом</p>
                      </div>
                      <div>
                        <p className="text-red-600">Цена водителя:</p>
                        <p className="font-medium">{request.driver_price} сом</p>
                      </div>
                      <div>
                        <p className="text-red-600">Налог:</p>
                        <p className="font-medium">{request.tax} сом</p>
                      </div>
                      <div>
                        <p className="text-red-600">Комиссия офиса:</p>
                        <p className="font-medium">{request.office_commission} сом</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-green-600">Прибыль:</p>
                        <p className="font-medium">
                          {Math.round(
                            parseFloat(request.our_price || '0') -
                            parseFloat(request.driver_price || '0') -
                            parseFloat(request.tax || '0') -
                            parseFloat(request.office_commission || '0')
                          )} сом
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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