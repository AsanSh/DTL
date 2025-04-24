import { useRequests } from '../context/RequestContext'
import { useEffect } from 'react'

export const UserManagement = () => {
  const { pendingUsers, approveUser, rejectUser, currentUser } = useRequests()

  useEffect(() => {
    console.log('Текущие пользователи в UserManagement:', pendingUsers)
  }, [pendingUsers])

  // Функция для получения цвета статуса
  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600'
      case 'approved':
        return 'text-green-600'
      case 'rejected':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  // Функция для получения текста статуса
  const getStatusText = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return 'Ожидает рассмотрения'
      case 'approved':
        return 'Одобрено'
      case 'rejected':
        return 'Отклонено'
      default:
        return status
    }
  }

  // Показываем всех пользователей, кроме администратора с id 1
  const filteredUsers = pendingUsers.filter(user => user.id !== 1)

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">Управление пользователями</h1>
        <p className="text-sm text-gray-600">
          {currentUser?.name} - {currentUser?.role === 'admin' ? 'Администратор' : 'Менеджер'}
        </p>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Заявки на регистрацию</h2>
            <p className="text-sm text-gray-600">Всего заявок: {filteredUsers.length}</p>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Нет заявок на регистрацию
            </div>
          ) : (
            <div className="divide-y">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(user.status)} bg-opacity-10 bg-current`}>
                        {getStatusText(user.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2">{user.email}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <span className="font-medium text-gray-700">Телефон:</span>
                      <span className="ml-2">{user.phone}</span>
                    </div>
                  </div>

                  {user.status === 'pending' && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => rejectUser(user.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                      >
                        Отклонить
                      </button>
                      <button
                        onClick={() => approveUser(user.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                      >
                        Одобрить
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 