import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AcademiaPage from './pages/AcademiaPage'
import MinijuegosPage from './pages/MinijuegosPage'
import PerfilPage from './pages/PerfilPage'
import LeaderboardPage from './pages/LeaderboardPage'
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Public routes for demo */}
          <Route path="/academia" element={<Layout />}>
            <Route index element={<AcademiaPage />} />
          </Route>
          
          <Route path="/minijuegos" element={<Layout />}>
            <Route index element={<MinijuegosPage />} />
          </Route>
          
          <Route path="/leaderboard" element={<Layout />}>
            <Route index element={<LeaderboardPage />} />
          </Route>
          
          <Route path="/games/bomba" element={<Layout />}>
            <Route index element={<BombaGamePage />} />
          </Route>
          
          <Route path="/games/guardia" element={<Layout />}>
            <Route index element={<GuardiaGamePage />} />
          </Route>
          
          {/* Protected routes */}
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<PerfilPage />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
