interface RequestStatsProps {
  total: number
  active: number
  closed: number
}

export const RequestStats = ({ total, active, closed }: RequestStatsProps) => {
  return (
    <div className="bg-white p-4 shadow-sm h-[20vh]">
      <div className="grid grid-rows-3 gap-2 h-full">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Общее кол-во заявок:</span>
          <span className="font-bold text-gray-800">{total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Активные заявки:</span>
          <span className="font-bold text-blue-600">{active}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Закрытые заявки:</span>
          <span className="font-bold text-green-600">{closed}</span>
        </div>
      </div>
    </div>
  )
} 