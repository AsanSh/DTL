import { useRequests } from '../context/RequestContext'

interface ManagerStats {
  name: string
  totalRequests: number
  activeRequests: number
  closedRequests: number
  totalRevenue: number
  totalCost: number
  profit: number
}

export const Analytics = () => {
  const { requests, currentUser } = useRequests()

  // Получаем список всех менеджеров и их статистику
  const managerStats = requests.reduce<{ [key: number]: ManagerStats }>((acc, request) => {
    if (!acc[request.created_by]) {
      const manager = request.created_by === 1 ? 'Администратор' : `Менеджер ${request.created_by - 1}`
      acc[request.created_by] = {
        name: manager,
        totalRequests: 0,
        activeRequests: 0,
        closedRequests: 0,
        totalRevenue: 0,
        totalCost: 0,
        profit: 0
      }
    }

    acc[request.created_by].totalRequests++
    
    if (request.status === 'active') {
      acc[request.created_by].activeRequests++
    } else {
      acc[request.created_by].closedRequests++
      // Финансовые расчеты для закрытых заявок
      const revenue = parseFloat(request.our_price) || 0
      const cost = parseFloat(request.driver_price) || 0
      const tax = parseFloat(request.tax) || 0
      const commission = parseFloat(request.office_commission) || 0
      
      acc[request.created_by].totalRevenue += revenue
      acc[request.created_by].totalCost += cost + tax + commission
      acc[request.created_by].profit += revenue - (cost + tax + commission)
    }

    return acc
  }, {})

  // Общая статистика
  const totalStats = Object.values(managerStats).reduce(
    (total, manager) => ({
      totalRequests: total.totalRequests + manager.totalRequests,
      activeRequests: total.activeRequests + manager.activeRequests,
      closedRequests: total.closedRequests + manager.closedRequests,
      totalRevenue: total.totalRevenue + manager.totalRevenue,
      totalCost: total.totalCost + manager.totalCost,
      profit: total.profit + manager.profit
    }),
    { totalRequests: 0, activeRequests: 0, closedRequests: 0, totalRevenue: 0, totalCost: 0, profit: 0 }
  )

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Аналитика</h1>
        <p className="text-sm text-gray-600">
          {currentUser?.name} - Администратор
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Общая статистика */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Общая статистика</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Всего заявок</p>
              <p className="text-lg font-semibold">{totalStats.totalRequests}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Активных</p>
              <p className="text-lg font-semibold">{totalStats.activeRequests}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Закрытых</p>
              <p className="text-lg font-semibold">{totalStats.closedRequests}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Общая прибыль</p>
              <p className="text-lg font-semibold text-green-600">
                {totalStats.profit.toLocaleString()} сом
              </p>
            </div>
          </div>
        </div>

        {/* Статистика по менеджерам */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Статистика по сотрудникам</h2>
          <div className="space-y-4">
            {Object.values(managerStats).map((manager) => (
              <div key={manager.name} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-semibold mb-2">{manager.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Всего заявок:</span>
                    <span className="float-right font-medium">{manager.totalRequests}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Активных:</span>
                    <span className="float-right font-medium">{manager.activeRequests}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Закрытых:</span>
                    <span className="float-right font-medium">{manager.closedRequests}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Выручка:</p>
                    <span className="float-right font-medium">
                      {manager.totalRevenue.toLocaleString()} сом
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Расходы:</p>
                    <span className="float-right font-medium">
                      {manager.totalCost.toLocaleString()} сом
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Прибыль:</p>
                    <span className={`float-right font-medium ${manager.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {manager.profit.toLocaleString()} сом
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 