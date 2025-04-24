import { useState } from 'react'

interface NewRequestFormProps {
  onClose: () => void
  onSubmit: (data: any) => void
}

export const NewRequestForm = ({ onClose, onSubmit }: NewRequestFormProps) => {
  const [formData, setFormData] = useState({
    closing_date: '',
    shipping_date: '',
    logist: '',
    driver_name: '',
    phone: '',
    cargo_type: '',
    vehicle_number: '',
    from_location: '',
    to_location: '',
    our_price: '',
    driver_price: '',
    tax: '',
    office_commission: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      id: Date.now(), // Временный ID для демонстрации
      created_at: new Date().toISOString(),
      status: 'active'
    })
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Новая заявка</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Дата закрытия</label>
              <input
                type="date"
                name="closing_date"
                value={formData.closing_date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Дата отгрузки</label>
              <input
                type="date"
                name="shipping_date"
                value={formData.shipping_date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Логист</label>
              <input
                type="text"
                name="logist"
                value={formData.logist}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ФИО водителя</label>
              <input
                type="text"
                name="driver_name"
                value={formData.driver_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Номер телефона</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]+"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Тип груза</label>
              <input
                type="text"
                name="cargo_type"
                value={formData.cargo_type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Госномер авто</label>
              <input
                type="text"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Откуда</label>
              <input
                type="text"
                name="from_location"
                value={formData.from_location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Куда</label>
              <input
                type="text"
                name="to_location"
                value={formData.to_location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Фрахт нам</label>
              <input
                type="number"
                name="our_price"
                value={formData.our_price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Фрахт водителю</label>
              <input
                type="number"
                name="driver_price"
                value={formData.driver_price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Налог</label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Комиссия офиса</label>
              <input
                type="number"
                name="office_commission"
                value={formData.office_commission}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 