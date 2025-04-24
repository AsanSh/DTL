import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useTelegram } from '../hooks/useTelegram'

interface RequestFormData {
  received_at: string
  loading_started_at: string
  loading_ended_at: string
  dispatched_at: string
  comment: string
}

const formatDateForInput = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const now = formatDateForInput(new Date())

export const RequestForm = () => {
  const { twa } = useTelegram()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm<RequestFormData>({
    mode: 'onChange',
    defaultValues: {
      received_at: now,
      loading_started_at: now,
      loading_ended_at: now,
      dispatched_at: now,
      comment: ''
    }
  })

  // Watch date fields for validation
  const receivedAt = watch('received_at')
  const loadingStartedAt = watch('loading_started_at')
  const loadingEndedAt = watch('loading_ended_at')
  const dispatchedAt = watch('dispatched_at')

  // Validate date sequence
  useEffect(() => {
    const validateDates = () => {
      const received = new Date(receivedAt)
      const loadingStarted = new Date(loadingStartedAt)
      const loadingEnded = new Date(loadingEndedAt)
      const dispatched = new Date(dispatchedAt)

      if (loadingStarted < received) {
        setError('loading_started_at', {
          type: 'manual',
          message: 'Время начала загрузки не может быть раньше времени поступления'
        })
        return false
      }

      if (loadingEnded < loadingStarted) {
        setError('loading_ended_at', {
          type: 'manual',
          message: 'Время завершения загрузки не может быть раньше времени начала'
        })
        return false
      }

      if (dispatched < loadingEnded) {
        setError('dispatched_at', {
          type: 'manual',
          message: 'Время отгрузки не может быть раньше времени завершения загрузки'
        })
        return false
      }

      clearErrors()
      return true
    }

    validateDates()
  }, [receivedAt, loadingStartedAt, loadingEndedAt, dispatchedAt, setError, clearErrors])

  useEffect(() => {
    if (twa?.MainButton) {
      if (isValid) {
        twa.MainButton.setText('Отправить заявку')
        twa.MainButton.show()
      } else {
        twa.MainButton.hide()
      }
    }
  }, [isValid, twa])

  const onSubmit = async (data: RequestFormData) => {
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // Convert local datetime strings to ISO format
          received_at: new Date(data.received_at).toISOString(),
          loading_started_at: new Date(data.loading_started_at).toISOString(),
          loading_ended_at: new Date(data.loading_ended_at).toISOString(),
          dispatched_at: new Date(data.dispatched_at).toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      console.log('Success:', result)
      reset({
        received_at: now,
        loading_started_at: now,
        loading_ended_at: now,
        dispatched_at: now,
        comment: ''
      })
      if (twa?.MainButton) {
        twa.MainButton.hide()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Setup MainButton click handler
  useEffect(() => {
    if (twa?.MainButton) {
      twa.MainButton.onClick(handleSubmit(onSubmit))
    }
    return () => {
      if (twa?.MainButton) {
        twa.MainButton.offClick(handleSubmit(onSubmit))
      }
    }
  }, [twa, handleSubmit])

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
          <span className="text-red-500 text-sm">
            {errors.received_at.message || 'Это поле обязательно'}
          </span>
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
          <span className="text-red-500 text-sm">
            {errors.loading_started_at.message || 'Это поле обязательно'}
          </span>
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
          <span className="text-red-500 text-sm">
            {errors.loading_ended_at.message || 'Это поле обязательно'}
          </span>
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
          <span className="text-red-500 text-sm">
            {errors.dispatched_at.message || 'Это поле обязательно'}
          </span>
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

      {!twa && (
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </button>
      )}
    </form>
  )
} 