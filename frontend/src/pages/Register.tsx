import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequests } from '../context/RequestContext'

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { register } = useRequests()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (formData.password !== formData.passwordConfirm) {
      setError('Пароли не совпадают')
      return
    }

    try {
      await register({
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Заявка отправлена!
            </h2>
            <p className="text-gray-600 mb-6">
              Ваша заявка на регистрацию успешно отправлена. Пожалуйста, ожидайте одобрения администратором.
              Мы уведомим вас по электронной почте, когда ваша учетная запись будет активирована.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-500"
            >
              Вернуться к входу
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Регистрация
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            После регистрации администратор рассмотрит вашу заявку
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Имя пользователя"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Полное имя"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="phone"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="passwordConfirm"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Подтвердите пароль"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Зарегистрироваться
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Уже есть аккаунт? Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 