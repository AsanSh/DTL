import { useState } from 'react'
import { Link } from 'react-router-dom'

export const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState('requests')

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/requests" 
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            activeTab === 'requests' ? 'text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs">Заявки</span>
        </Link>

        <Link 
          to="/closed" 
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            activeTab === 'closed' ? 'text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('closed')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs">Закрыто</span>
        </Link>

        <Link 
          to="/data" 
          className={`flex flex-col items-center space-y-1 px-4 py-2 ${
            activeTab === 'data' ? 'text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('data')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8h8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8" />
          </svg>
          <span className="text-xs">Данные</span>
        </Link>
      </div>
    </div>
  )
} 