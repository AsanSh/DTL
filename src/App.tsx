import { useTelegram } from './hooks/useTelegram'
import { RequestForm } from './components/RequestForm'

function App() {
  const { user } = useTelegram()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 bg-indigo-600 text-white">
          <h1 className="text-xl font-bold">Добавление заявки</h1>
          {user.username && (
            <p className="text-sm text-indigo-100">
              Пользователь: {user.username}
            </p>
          )}
        </div>
        <RequestForm />
      </div>
    </div>
  )
}

export default App 