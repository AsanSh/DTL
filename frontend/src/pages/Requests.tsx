import { useState } from 'react'
import { WelcomeHeader } from '../components/WelcomeHeader'
import { RequestStats } from '../components/RequestStats'
import { ActiveRequestsList } from '../components/ActiveRequestsList'
import { NewRequestForm } from '../components/NewRequestForm'
import { useRequests } from '../context/RequestContext'

interface Request {
  id: number
  created_at: string
  logist: string
  driver_name: string
  cargo_type: string
  from_location: string
  to_location: string
  status: 'active' | 'closed'
  // Добавьте остальные поля по необходимости
}

export const Requests = () => {
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const { requests, addRequest, closeRequest, cancelRequest } = useRequests()

  const activeRequests = requests.filter(r => r.status === 'active')
  const closedRequests = requests.filter(r => r.status === 'closed')

  return (
    <div className="flex flex-col h-screen pb-16">
      <WelcomeHeader onAddClick={() => setShowNewRequestForm(true)} />
      <RequestStats
        total={requests.length}
        active={activeRequests.length}
        closed={closedRequests.length}
      />
      <ActiveRequestsList
        requests={activeRequests}
        onRequestClose={closeRequest}
        onRequestCancel={cancelRequest}
      />
      
      {showNewRequestForm && (
        <NewRequestForm
          onClose={() => setShowNewRequestForm(false)}
          onSubmit={addRequest}
        />
      )}
    </div>
  )
} 