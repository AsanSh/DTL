import { useTelegram } from '../hooks/useTelegram'

export const WelcomeHeader = ({ onAddClick }: { onAddClick: () => void }) => {
  const { user } = useTelegram()

  return (
    <div className="bg-white p-4 shadow-sm h-[15vh]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Добро пожаловать!</h1>
          <p className="text-sm text-gray-600">
            {user?.username ? `@${user.username}` : 'Загрузка...'}
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Добавить
        </button>
      </div>
    </div>
  )
} 