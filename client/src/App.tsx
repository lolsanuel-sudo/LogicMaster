import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AcademiaPage from './pages/AcademiaPage'
import MinijuegosPage from './pages/MinijuegosPage'
import BombaGamePage from './pages/games/BombaGamePage'
import GuardiaGamePage from './pages/games/GuardiaGamePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Public routes for demo - wrapped in Layout */}
          <Route path="/academia" element={<Layout><AcademiaPage /></Layout>} />
          <Route path="/minijuegos" element={<Layout><MinijuegosPage /></Layout>} />
          <Route path="/games/bomba" element={<Layout><BombaGamePage /></Layout>} />
          <Route path="/games/guardia" element={<Layout><GuardiaGamePage /></Layout>} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
