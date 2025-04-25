import { Link, useLocation } from 'react-router-dom'
import { useRequests } from '../context/RequestContext'

export const Navigation = () => {
  const location = useLocation()
  const { isAdmin } = useRequests()
  const isAdminUser = isAdmin()

  const getNavClass = (path: string) => {
    const baseClass = "flex flex-col items-center justify-center flex-1 py-2"
    return `${baseClass} ${location.pathname === path ? 'text-blue-600' : 'text-gray-600'}`
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center">
        <Link to="/" className={getNavClass('/')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs mt-1">Активные</span>
        </Link>

        <Link to="/closed" className={getNavClass('/closed')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs mt-1">Закрытые</span>
        </Link>

        {isAdminUser && (
          <Link to="/analytics" className={getNavClass('/analytics')}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs mt-1">Аналитика</span>
          </Link>
        )}

        <Link to="/users" className={getNavClass('/users')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1">Профиль</span>
        </Link>
      </div>
    </nav>
  )
} 