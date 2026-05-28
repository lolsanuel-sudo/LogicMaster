import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, RefreshCw, Crown, Lock, Unlock } from 'lucide-react'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'

export default function GuardiaGamePage() {
  const navigate = useNavigate()

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle')
  const [puzzle, setPuzzle] = useState<{ question: string; options: string[]; answer: string } | null>(null)
  const [result, setResult] = useState<{ won: boolean; correctAnswer: string; xp: number } | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    // More varied and interesting puzzles
    const puzzles = [
      { question: 'Si A es verdadero y B es falso, entonces A AND B es...', options: ['Verdadero', 'Falso'], answer: 'Falso' },
      { question: 'Si A es verdadero o B es falso, entonces A OR B es...', options: ['Verdadero', 'Falso'], answer: 'Verdadero' },
      { question: 'La negación de verdadero es...', options: ['Verdadero', 'Falso'], answer: 'Falso' },
      { question: 'Si A implica B y A es verdadero, entonces B es...', options: ['Verdadero', 'Falso'], answer: 'Verdadero' },
      { question: 'A XOR B es verdadero cuando...', options: ['Ambos son iguales', 'Son diferentes'], answer: 'Son diferentes' },
      { question: 'La doble negación de A es...', options: ['A', 'NOT A'], answer: 'A' },
      { question: 'Si A es falso, entonces NOT A es...', options: ['Verdadero', 'Falso'], answer: 'Verdadero' },
      { question: 'A OR NOT A siempre es...', options: ['Verdadero', 'Falso'], answer: 'Verdadero' },
    ]
    const random = puzzles[Math.floor(Math.random() * puzzles.length)]
    
    setPuzzle(random)
    setResult(null)
    setSelectedOption(null)
    setGameState('playing')
  }

  const makeChoice = (choice: string) => {
    if (gameState !== 'playing' || !puzzle) return

    setSelectedOption(choice)
    
    setTimeout(() => {
      const won = choice === puzzle.answer
      const xp = won ? 50 + (streak * 10) : 0
      
      setResult({
        won,
        correctAnswer: puzzle.answer,
        xp,
      })
      
      if (won) {
        setScore(score + xp)
        setStreak(streak + 1)
      } else {
        setStreak(0)
      }
      
      setGameState('result')
    }, 500)
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="h-12 w-12 text-blue-500" />
            </motion.div>
            El Guardián del Castillo
          </h1>
          <p className="text-slate-400 text-lg">¡Demuestra tu conocimiento lógico para pasar!</p>
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

      <Card className="max-w-3xl mx-auto border-2 border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardContent className="p-8">
          {/* Guardian Message with better styling */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-2 border-blue-500/30"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="h-12 w-12 text-blue-400" />
              </motion.div>
              <div>
                <p className="text-xl text-blue-200 font-semibold">🛡️ Guardián del Castillo</p>
                <p className="text-blue-300 italic">"Solo aquellos que dominen la lógica podrán pasar..."</p>
              </div>
            </div>
          </motion.div>

          {/* Puzzle */}
          <AnimatePresence mode="wait">
            {gameState === 'playing' && puzzle && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-slate-900/50 rounded-2xl p-8 border-2 border-slate-700"
                  >
                    <p className="text-3xl font-bold text-white mb-4">{puzzle.question}</p>
                    <p className="text-slate-400 text-lg">Selecciona la opción correcta</p>
                  </motion.div>
                </div>

                <div className="flex gap-6 justify-center flex-wrap">
                  {puzzle.options.map((option, index) => (
                    <motion.div
                      key={option}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        onClick={() => makeChoice(option)}
                        variant="outline"
                        className={`text-xl px-12 py-8 border-2 ${
                          selectedOption === option
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 hover:border-blue-400'
                        }`}
                      >
                        {option}
                      </Button>
                    </motion.div>
                  ))}
                </div>
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
                      <Unlock className="h-32 w-32 text-green-500" />
                      <motion.div
                        className="absolute inset-0 bg-green-500/20 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Lock className="h-32 w-32 text-red-500" />
                      <motion.div
                        className="absolute inset-0 bg-red-500/20 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                  )}
                </motion.div>
                <h2 className={`text-5xl font-black mb-4 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                  {result.won ? '¡PUERTA ABIERTA! 🚪' : '¡PUERTA CERRADA! 🔒'}
                </h2>
                <p className="text-xl text-slate-300 mb-6">
                  {result.won
                    ? `¡Excelente! +${result.xp} XP`
                    : `La respuesta era ${result.correctAnswer}`
                  }
                </p>
                {result.won && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-center gap-2 text-yellow-400">
                      <Crown className="h-6 w-6" />
                      <span className="text-lg font-semibold">¡Has demostrado tu sabiduría!</span>
                    </div>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={startNewGame} className="gap-3 text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <RefreshCw className="h-6 w-6" />
                    Siguiente Desafío
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
