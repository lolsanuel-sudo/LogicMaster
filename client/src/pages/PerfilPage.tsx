import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { usersAPI, progressAPI } from '../lib/api'
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { calculateWinRate } from '../lib/utils'

export default function PerfilPage() {
  const user = useAuthStore((state) => state.user)

  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: () => usersAPI.getStats(user!.id).then(res => res.data),
    enabled: !!user?.id,
  })

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => progressAPI.getAchievements().then(res => res.data),
  })

  if (!user) return null

  const winRate = stats ? calculateWinRate(stats.overall.gamesWon, stats.overall.gamesPlayed) : 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">👤 Perfil del Jugador</h1>
        <p className="text-slate-400">Estadísticas y logros</p>
      </div>

      {/* Profile Header */}
      <Card className="mb-8 border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-3xl font-bold text-white">
                {user.displayName?.[0]?.toUpperCase() || user.username[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user.displayName || user.username}</h2>
              <p className="text-slate-400">@{user.username}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-400">Nivel {user.level}</p>
              <p className="text-sm text-slate-400">{user.xp} XP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{user.totalScore}</p>
            <p className="text-sm text-slate-400">Puntuación Total</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{user.streak}</p>
            <p className="text-sm text-slate-400">Racha Actual</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{user.maxStreak}</p>
            <p className="text-sm text-slate-400">Mejor Racha</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{winRate}%</p>
            <p className="text-sm text-slate-400">Tasa de Victoria</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card className="mb-8 border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Estadísticas Detalladas</CardTitle>
          <CardDescription className="text-slate-400">
            Tu rendimiento en los diferentes modos de juego
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div>
                  <p className="font-medium text-white">Partidas Totales</p>
                  <p className="text-sm text-slate-400">Todos los modos de juego</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{stats.overall.gamesPlayed}</p>
                  <p className="text-sm text-green-400">{stats.overall.gamesWon} victorias</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Cargando estadísticas...</p>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">🏆 Logros</CardTitle>
          <CardDescription className="text-slate-400">
            Logros desbloqueados y pendientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {achievements ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                      : 'bg-slate-900/50 border border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-white">{achievement.title}</p>
                      <p className="text-xs text-slate-400">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <p className="text-xs text-green-400">
                      +{achievement.xpReward} XP
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">Cargando logros...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
