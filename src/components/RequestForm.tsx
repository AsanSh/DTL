import { useForm } from 'react-hook-form'

interface RequestFormData {
  received_at: string
  loading_started_at: string
  loading_ended_at: string
  dispatched_at: string
  comment: string
}

export const RequestForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData>()

  const onSubmit = (data: RequestFormData) => {
    console.log('Form submitted:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Время поступления
        </label>
        <input
          type="datetime-local"
          {...register('received_at', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.received_at && (
          <span className="text-red-500 text-sm">Это поле обязательно</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Время начала загрузки
        </label>
        <input
          type="datetime-local"
          {...register('loading_started_at', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.loading_started_at && (
          <span className="text-red-500 text-sm">Это поле обязательно</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Время завершения загрузки
        </label>
        <input
          type="datetime-local"
          {...register('loading_ended_at', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.loading_ended_at && (
          <span className="text-red-500 text-sm">Это поле обязательно</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Время отгрузки
        </label>
        <input
          type="datetime-local"
          {...register('dispatched_at', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.dispatched_at && (
          <span className="text-red-500 text-sm">Это поле обязательно</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Комментарий
        </label>
        <textarea
          {...register('comment')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Отправить
      </button>
    </form>
  )
} 