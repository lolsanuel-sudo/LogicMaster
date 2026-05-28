import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bomb, Clock, CheckCircle, XCircle, RefreshCw, Zap, Flame } from 'lucide-react'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'

export default function BombaGamePage() {
  const navigate = useNavigate()

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle')
  const [expression, setExpression] = useState('')
  const [values, setValues] = useState<Record<string, boolean>>({})
  const [correctAnswer, setCorrectAnswer] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [result, setResult] = useState<{ won: boolean; correctAnswer: boolean; xp: number } | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    startNewGame()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      // Shake effect when time is running low
      if (timeLeft <= 5 && timeLeft > 0) {
        setIsShaking(true)
      }
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeExpired()
    }
    return () => {
      clearTimeout(timer)
      setIsShaking(false)
    }
  }, [timeLeft, gameState])

  const startNewGame = () => {
    // More varied and interesting expressions
    const expressions = [
      { expr: 'A AND B', vals: { A: true, B: false }, correct: false },
      { expr: 'A OR B', vals: { A: true, B: false }, correct: true },
      { expr: 'NOT A', vals: { A: true }, correct: false },
      { expr: 'A AND (B OR C)', vals: { A: true, B: false, C: true }, correct: true },
      { expr: '(A AND B) OR C', vals: { A: true, B: false, C: true }, correct: true },
      { expr: 'NOT (A AND B)', vals: { A: true, B: true }, correct: false },
      { expr: 'A XOR B', vals: { A: true, B: false }, correct: true },
      { expr: 'A IMPLICA B', vals: { A: true, B: false }, correct: false },
    ]
    const random = expressions[Math.floor(Math.random() * expressions.length)]
    
    setExpression(random.expr)
    setValues(random.vals as Record<string, boolean>)
    setCorrectAnswer(random.correct)
    setTimeLeft(15)
    setResult(null)
    setIsShaking(false)
    setGameState('playing')
  }

  const handleTimeExpired = () => {
    setGameState('result')
    setResult({ won: false, correctAnswer: correctAnswer, xp: 0 })
    setStreak(0)
    setIsShaking(false)
  }

  const makeChoice = (choice: boolean) => {
    if (gameState !== 'playing') return

    const won = choice === correctAnswer
    const xp = won ? 50 + (streak * 10) : 0
    
    setResult({
      won,
      correctAnswer: correctAnswer,
      xp,
    })
    
    if (won) {
      setScore(score + xp)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
    
    setGameState('result')
    setIsShaking(false)
  }

  const getTimerColor = () => {
    if (timeLeft <= 3) return 'text-red-500'
    if (timeLeft <= 7) return 'text-orange-500'
    if (timeLeft <= 11) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getTimerBg = () => {
    if (timeLeft <= 3) return 'bg-red-500/20 border-red-500'
    if (timeLeft <= 7) return 'bg-orange-500/20 border-orange-500'
    if (timeLeft <= 11) return 'bg-yellow-500/20 border-yellow-500'
    return 'bg-green-500/20 border-green-500'
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <motion.div
              animate={isShaking ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Bomb className="h-12 w-12 text-red-500" />
            </motion.div>
            Desactiva la Bomba
          </h1>
          <p className="text-slate-400 text-lg">¡Corta el cable correcto antes de que explote!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-400">{score} XP</p>
            <p className="text-sm text-slate-400">Racha: {streak} 🔥</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/minijuegos')}>
            Volver
          </Button>
        </div>
      </div>

      <motion.div
        animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Card className={`max-w-3xl mx-auto border-2 ${isShaking ? 'border-red-500 bg-red-950/30' : 'border-slate-800 bg-slate-950/50'} backdrop-blur-xl`}>
          <CardContent className="p-8">
            {/* Timer with pulse effect */}
            <div className="mb-8 text-center">
              <motion.div
                className={`inline-flex items-center gap-4 px-10 py-6 rounded-3xl border-4 ${getTimerBg()}`}
                animate={timeLeft <= 5 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Clock className={`h-10 w-10 ${getTimerColor()}`} />
                <span className={`text-6xl font-black ${getTimerColor()}`}>{timeLeft}s</span>
                {timeLeft <= 5 && <Flame className="h-8 w-8 text-orange-500 animate-pulse" />}
              </motion.div>
            </div>

            {/* Expression with better styling */}
            <div className="mb-8 text-center">
              <div className="mb-6">
                <p className="text-xl text-slate-400 mb-4 font-semibold">Valores de las variables:</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {Object.entries(values).map(([key, value]) => (
                    <motion.span
                      key={key}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`px-6 py-3 rounded-xl font-bold text-lg border-2 ${
                        value 
                          ? 'bg-green-500/30 text-green-400 border-green-500' 
                          : 'bg-red-500/30 text-red-400 border-red-500'
                      }`}
                    >
                      {key} = {value ? 'VERDADERO' : 'FALSO'}
                    </motion.span>
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 rounded-2xl p-6 border-2 border-slate-700"
              >
                <p className="text-4xl font-black text-white tracking-wider">{expression}</p>
              </motion.div>
            </div>

            {/* Action Buttons with better styling */}
            <AnimatePresence mode="wait">
              {gameState === 'playing' && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="flex gap-6 justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => makeChoice(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xl px-12 py-8 shadow-lg shadow-green-500/30"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Zap className="h-8 w-8" />
                        <span>✂️ VERDADERO</span>
                      </div>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => makeChoice(false)}
                      className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-xl px-12 py-8 shadow-lg shadow-red-500/30"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Flame className="h-8 w-8" />
                        <span>✂️ FALSO</span>
                      </div>
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {gameState === 'result' && result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: result.won ? 360 : 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className={`mb-8 flex justify-center`}
                  >
                    {result.won ? (
                      <div className="relative">
                        <CheckCircle className="h-32 w-32 text-green-500" />
                        <motion.div
                          className="absolute inset-0 bg-green-500/20 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <XCircle className="h-32 w-32 text-red-500" />
                        <motion.div
                          className="absolute inset-0 bg-red-500/20 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </div>
                    )}
                  </motion.div>
                  <h2 className={`text-5xl font-black mb-4 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                    {result.won ? '¡BOMBA DESACTIVADA!' : '¡BOOM! 💥'}
                  </h2>
                  <p className="text-xl text-slate-300 mb-6">
                    {result.won
                      ? `¡Increíble! +${result.xp} XP`
                      : `La respuesta era ${result.correctAnswer ? 'VERDADERO' : 'FALSO'}`
                    }
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={startNewGame} className="gap-3 text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <RefreshCw className="h-6 w-6" />
                      Siguiente Ronda
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
