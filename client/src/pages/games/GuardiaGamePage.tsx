import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'

export default function GuardiaGamePage() {
  const navigate = useNavigate()

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle')
  const [puzzle, setPuzzle] = useState<{ question: string; options: string[]; answer: string } | null>(null)
  const [result, setResult] = useState<{ won: boolean; correctAnswer: string; xp: number } | null>(null)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    // Demo data
    const puzzles = [
      { question: 'Si A es verdadero y B es falso, entonces A AND B es...', options: ['Verdadero', 'Falso'], answer: 'Falso' },
      { question: 'Si A es verdadero o B es falso, entonces A OR B es...', options: ['Verdadero', 'Falso'], answer: 'Verdadero' },
      { question: 'La negación de verdadero es...', options: ['Verdadero', 'Falso'], answer: 'Falso' },
      { question: 'Si A implica B y A es verdadero, entonces B es...', options: ['Verdadero', 'Falso'], answer: 'Verdadero' },
    ]
    const random = puzzles[Math.floor(Math.random() * puzzles.length)]
    
    setPuzzle(random)
    setResult(null)
    setGameState('playing')
  }

  const makeChoice = (choice: string) => {
    if (gameState !== 'playing' || !puzzle) return

    const won = choice === puzzle.answer
    setResult({
      won,
      correctAnswer: puzzle.answer,
      xp: won ? 50 : 0,
    })
    setGameState('result')
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="h-10 w-10 text-blue-500" />
            El Guardián del Castillo
          </h1>
          <p className="text-slate-400">Completa la afirmación lógica para abrir la puerta</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/minijuegos')}>
          Volver
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <CardContent className="p-8">
          {/* Guardian Message */}
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30">
            <p className="text-lg text-blue-200 italic">
              🛡️ Guardián: "Solo aquellos que dominen la lógica podrán pasar..."
            </p>
          </div>

          {/* Puzzle */}
          <AnimatePresence mode="wait">
            {gameState === 'playing' && puzzle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8 text-center">
                  <p className="text-3xl font-bold text-white mb-2">{puzzle.question}</p>
                  <p className="text-slate-400">Selecciona la opción correcta</p>
                </div>

                <div className="flex gap-4 justify-center flex-wrap">
                  {puzzle.options.map((option) => (
                    <Button
                      key={option}
                      size="lg"
                      onClick={() => makeChoice(option)}
                      variant="outline"
                      className="text-lg"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
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
                  {result.won ? '¡PUERTA ABIERTA!' : '¡PUERTA CERRADA!'}
                </h2>
                <p className="text-slate-400 mb-4">
                  {result.won
                    ? `¡Correcto! +${result.xp} XP`
                    : `La respuesta era ${result.correctAnswer}`
                  }
                </p>
                <Button onClick={startNewGame} className="gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Siguiente Desafío
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
