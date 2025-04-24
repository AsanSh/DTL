import { Link, useLocation } from 'react-router-dom'
import { useRequests } from '../context/RequestContext'

export const Navigation = () => {
  const location = useLocation()
  const { requests } = useRequests()
  const activeCount = requests.filter(r => r.status === 'active').length
  const closedCount = requests.filter(r => r.status === 'closed').length

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around">
        <Link 
          to="/" 
          className={`flex flex-col items-center p-2 flex-1 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <span className="text-xs">Активные</span>
          <span className="text-sm font-semibold">{activeCount}</span>
        </Link>
        <Link 
          to="/closed" 
          className={`flex flex-col items-center p-2 flex-1 ${location.pathname === '/closed' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <span className="text-xs">Закрытые</span>
          <span className="text-sm font-semibold">{closedCount}</span>
        </Link>
        <Link 
          to="/new" 
          className={`flex flex-col items-center p-2 flex-1 ${location.pathname === '/new' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <span className="text-xs">Новая</span>
        </Link>
      </div>
    </nav>
  )
} 