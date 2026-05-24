import { Outlet, Link, useLocation } from 'react-router-dom'
import { Brain, BookOpen, Gamepad2, User, Trophy, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Academia', href: '/academia', icon: BookOpen },
  { name: 'Minijuegos', href: '/minijuegos', icon: Gamepad2 },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Perfil', href: '/perfil', icon: User },
]

export default function Layout() {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-slate-800 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse-glow">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LogicMaster</h1>
              <p className="text-xs text-slate-400">Lógica Proposicional</p>
            </div>
          </div>

          {/* User info */}
          <div className="border-b border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                <span className="text-lg font-bold text-white">
                  {user?.displayName?.[0]?.toUpperCase() || user?.username[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{user?.displayName || user?.username}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Nivel {user?.level}</span>
                  <span className="text-xs text-blue-400">{user?.xp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-800 p-4">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64">
        <Outlet />
      </main>
    </div>
  )
}
