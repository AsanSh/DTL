import { useTelegram } from '../hooks/useTelegram'

interface WelcomeHeaderProps {
  onAddClick: () => void
  userName: string
  isAdmin: boolean
}

export const WelcomeHeader = ({ onAddClick, userName, isAdmin }: WelcomeHeaderProps) => {
  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Добро пожаловать, {userName}!</h1>
          <p className="text-sm text-gray-600">{isAdmin ? 'Администратор' : 'Менеджер'}</p>
        </div>
        <button
          onClick={onAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Новая заявка
        </button>
      </div>
    </div>
  )
} 