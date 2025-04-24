import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Requests } from './pages/Requests'
import { Closed } from './pages/Closed'
import { RequestProvider } from './context/RequestContext'

function App() {
  return (
    <RequestProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Requests />} />
            <Route path="/closed" element={<Closed />} />
            <Route path="/new" element={<Requests />} />
          </Routes>
          <Navigation />
        </div>
      </Router>
    </RequestProvider>
  )
}

export default App 