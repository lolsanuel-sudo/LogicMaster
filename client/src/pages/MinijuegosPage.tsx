import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Gamepad2, Bomb, Shield, Zap } from 'lucide-react'
import Button from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'

const games = [
  {
    id: 'bomba',
    name: 'Desactiva la Bomba Lógica',
    description: 'Evalúa expresiones lógicas contra el reloj antes de que explote',
    icon: Bomb,
    color: 'from-red-500 to-orange-500',
    link: '/games/bomba',
    difficulty: 'Medio',
  },
  {
    id: 'guardia',
    name: 'El Guardián del Castillo',
    description: 'Completa afirmaciones lógicas para abrir la puerta',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    link: '/games/guardia',
    difficulty: 'Fácil',
  },
  {
    id: 'circuits',
    name: 'Constructor de Circuitos',
    description: 'Construye circuitos lógicos visuales',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    link: '#',
    difficulty: 'Difícil',
    comingSoon: true,
  },
]

export default function MinijuegosPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Gamepad2 className="h-10 w-10 text-purple-400" />
          Minijuegos de Lógica
        </h1>
        <p className="text-slate-400">Pon a prueba tus conocimientos con nuestros desafíos interactivos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-slate-800 bg-slate-950/50 backdrop-blur-xl hover:border-slate-700 transition-all ${game.comingSoon ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${game.color}`}>
                  <game.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">{game.name}</CardTitle>
                <CardDescription className="text-slate-400">
                  {game.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Dificultad:</span>
                  <span className={`text-xs font-bold ${
                    game.difficulty === 'Fácil' ? 'text-green-400' :
                    game.difficulty === 'Medio' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
                {game.comingSoon ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Próximamente
                  </Button>
                ) : (
                  <Link to={game.link}>
                    <Button className="w-full">
                      Jugar Ahora
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-12">
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">📊 Tu Progreso</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">0</p>
                <p className="text-sm text-slate-400">Partidas Jugadas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">0</p>
                <p className="text-sm text-slate-400">Victorias</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">0%</p>
                <p className="text-sm text-slate-400">Tasa de Victoria</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
