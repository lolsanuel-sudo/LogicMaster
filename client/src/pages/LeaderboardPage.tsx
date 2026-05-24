import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Trophy, Medal, Crown } from 'lucide-react'
import { leaderboardAPI } from '../lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { calculateWinRate } from '../lib/utils'

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState('score')

  const { data: leaderboardData } = useQuery({
    queryKey: ['leaderboard', sortBy],
    queryFn: () => leaderboardAPI.get({ sortBy }).then(res => res.data),
  })

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />
    return <span className="text-lg font-bold text-slate-400">#{rank}</span>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Trophy className="h-10 w-10 text-yellow-400" />
          Leaderboard Global
        </h1>
        <p className="text-slate-400">Los mejores jugadores de LogicMaster</p>
      </div>

      {/* Sort Options */}
      <Card className="mb-8 border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <button
              onClick={() => setSortBy('score')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'score'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Puntuación
            </button>
            <button
              onClick={() => setSortBy('level')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'level'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Nivel
            </button>
            <button
              onClick={() => setSortBy('wins')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'wins'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Victorias
            </button>
            <button
              onClick={() => setSortBy('streak')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === 'streak'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Racha
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardContent className="p-6">
          {leaderboardData ? (
            <div className="space-y-3">
              {leaderboardData.leaderboard.map((player: any, index: number) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-500/30'
                      : index === 2
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30'
                      : 'bg-slate-900/50 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center">
                    {getRankIcon(player.rank)}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-lg font-bold text-white">
                      {player.displayName?.[0]?.toUpperCase() || player.username[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{player.displayName || player.username}</p>
                    <p className="text-sm text-slate-400">@{player.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-400">{player.totalScore}</p>
                    <p className="text-xs text-slate-400">Nivel {player.level}</p>
                  </div>
                  <div className="text-right w-24">
                    <p className="text-sm font-medium text-white">{player.gamesWon}W</p>
                    <p className="text-xs text-slate-400">{player.winRate}% win rate</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400">Cargando leaderboard...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
