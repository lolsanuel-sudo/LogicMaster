import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bomb, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { gamesAPI } from '../../lib/api'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'

export default function BombaGamePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle')
  const [expression, setExpression] = useState('')
  const [values, setValues] = useState<Record<string, boolean>>({})
  const [timeLeft, setTimeLeft] = useState(10)
  const [result, setResult] = useState<{ won: boolean; correctAnswer: boolean; xp: number } | null>(null)

  useEffect(() => {
    startNewGame()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeExpired()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameState])

  const startNewGame = async () => {
    try {
      const response = await gamesAPI.generate('bomba', user?.level)
      setExpression(response.data.expression)
      setValues(response.data.values)
      setTimeLeft(10)
      setResult(null)
      setGameState('playing')
    } catch (error) {
      console.error('Error generating game:', error)
    }
  }

  const handleTimeExpired = () => {
    setGameState('result')
    setResult({ won: false, correctAnswer: false, xp: 0 })
  }

  const makeChoice = async (choice: boolean) => {
    if (gameState !== 'playing') return

    try {
      const response = await gamesAPI.submitBomba({
        expression,
        values,
        answer: choice,
        duration: 10 - timeLeft,
      })

      setResult({
        won: response.data.won,
        correctAnswer: response.data.correctAnswer,
        xp: response.data.xp,
      })

      if (response.data.won) {
        updateUser({
          xp: (user?.xp || 0) + response.data.xp,
          streak: response.data.streak,
          totalScore: (user?.totalScore || 0) + (10 - timeLeft),
        })
      }

      setGameState('result')
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  const getTimerColor = () => {
    if (timeLeft <= 3) return 'text-red-500'
    if (timeLeft <= 6) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Bomb className="h-10 w-10 text-red-500" />
            Desactiva la Bomba Lógica
          </h1>
          <p className="text-slate-400">Evalúa la expresión y corta el cable correcto antes de que explote</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/minijuegos')}>
          Volver
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardContent className="p-8">
          {/* Timer */}
          <div className="mb-8 text-center">
            <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900/50 border-2 ${
              timeLeft <= 3 ? 'border-red-500' : timeLeft <= 6 ? 'border-yellow-500' : 'border-green-500'
            }`}>
              <Clock className={`h-8 w-8 ${getTimerColor()}`} />
              <span className={`text-5xl font-bold ${getTimerColor()}`}>{timeLeft}s</span>
            </div>
          </div>

          {/* Expression */}
          <div className="mb-8 text-center">
            <div className="mb-4">
              <p className="text-lg text-slate-400 mb-2">Valores:</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {Object.entries(values).map(([key, value]) => (
                  <span
                    key={key}
                    className={`px-3 py-1 rounded-lg font-bold ${
                      value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {key}={value ? 'V' : 'F'}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{expression}</p>
          </div>

          {/* Action Buttons */}
          <AnimatePresence mode="wait">
            {gameState === 'playing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4 justify-center"
              >
                <Button
                  size="lg"
                  onClick={() => makeChoice(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  ✂️ Cortar Cable Verdadero
                </Button>
                <Button
                  size="lg"
                  onClick={() => makeChoice(false)}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
                >
                  ✂️ Cortar Cable Falso
                </Button>
              </motion.div>
            )}

            {gameState === 'result' && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className={`mb-6 flex justify-center`}>
                  {result.won ? (
                    <CheckCircle className="h-24 w-24 text-green-500" />
                  ) : (
                    <XCircle className="h-24 w-24 text-red-500" />
                  )}
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                  {result.won ? '¡BOMBA DESACTIVADA!' : '¡BOOM!'}
                </h2>
                <p className="text-slate-400 mb-4">
                  {result.won
                    ? `¡Correcto! +${result.xp} XP`
                    : `La respuesta era ${result.correctAnswer ? 'VERDADERO' : 'FALSO'}`
                  }
                </p>
                <Button onClick={startNewGame} className="gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Siguiente Ronda
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
