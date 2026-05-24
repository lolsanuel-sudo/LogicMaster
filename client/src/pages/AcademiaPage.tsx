import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Calculator, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import Input from '../components/ui/Input'

const operators = [
  {
    name: 'AND (Conjunción)',
    symbol: '∧',
    desc: 'Verdadero solo si AMBOS son verdaderos',
    example: 'True AND False = False',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'OR (Disyunción)',
    symbol: '∨',
    desc: 'Verdadero si AL MENOS UNO es verdadero',
    example: 'True OR False = True',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'NOT (Negación)',
    symbol: '¬',
    desc: 'Invierte el valor de verdad',
    example: 'NOT True = False',
    color: 'from-red-500 to-orange-500',
  },
  {
    name: 'XOR (O Exclusivo)',
    symbol: '⊕',
    desc: 'Verdadero si SON DIFERENTES',
    example: 'True XOR False = True',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'IMPLICA (→)',
    symbol: '→',
    desc: 'Falso solo si el primero es True y el segundo False',
    example: 'True → False = False',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    name: 'EQUIVALE (↔)',
    symbol: '↔',
    desc: 'Verdadero si ambos son IGUALES',
    example: 'True ↔ True = True',
    color: 'from-indigo-500 to-violet-500',
  },
]

export default function AcademiaPage() {
  const [expression, setExpression] = useState('')
  const [truthTable, setTruthTable] = useState<any[]>([])
  const [generating, setGenerating] = useState(false)

  const generateTable = () => {
    if (!expression) return
    
    setGenerating(true)
    // Simulación - en producción esto llamaría a la API
    setTimeout(() => {
      const variables = expression.match(/[A-Z]/g) || []
      const table = []
      
      for (let i = 0; i < Math.pow(2, variables.length); i++) {
        const binary = i.toString(2).padStart(variables.length, '0')
        const row: any = {}
        variables.forEach((v, idx) => {
          row[v] = binary[idx] === '1'
        })
        // Evaluación simple
        let result = true
        if (expression.includes('AND')) {
          result = Object.values(row).every((v: any) => v)
        } else if (expression.includes('OR')) {
          result = Object.values(row).some((v: any) => v)
        }
        row.result = result
        table.push(row)
      }
      
      setTruthTable(table)
      setGenerating(false)
    }, 500)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">📚 Academia de Lógica</h1>
        <p className="text-slate-400">Aprende los fundamentos de la lógica proposicional</p>
      </div>

      {/* Operator Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-400" />
          Operadores Lógicos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operators.map((operator, index) => (
            <motion.div
              key={operator.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl hover:border-slate-700 transition-all">
                <CardContent className="p-6">
                  <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${operator.color}`}>
                    <span className="text-3xl font-bold text-white">{operator.symbol}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{operator.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{operator.desc}</p>
                  <p className="text-xs text-slate-500 italic">Ejemplo: {operator.example}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Truth Table Calculator */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-purple-400" />
          Calculadora de Tablas de Verdad
        </h2>
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Ingresa una expresión lógica
              </label>
              <Input
                type="text"
                placeholder="Ej: A AND (B OR C)"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="text-lg"
              />
              <p className="mt-2 text-xs text-slate-500">
                Usa: AND, OR, NOT para operadores. Variables: A, B, C, etc.
              </p>
            </div>
            <Button onClick={generateTable} disabled={generating || !expression}>
              {generating ? 'Generando...' : 'Generar Tabla'}
            </Button>

            {truthTable.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 overflow-x-auto"
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      {Object.keys(truthTable[0]).map((key) => (
                        <th key={key} className="px-4 py-3 text-left text-sm font-bold text-white">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {truthTable.map((row, index) => (
                      <tr key={index} className="border-b border-slate-800">
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-sm">
                            <span className={`inline-flex px-2 py-1 rounded ${
                              value 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {value ? 'V' : 'F'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CTA to Games */}
      <div className="mt-12 text-center">
        <Link to="/minijuegos">
          <Button size="lg" className="gap-2">
            Practicar con Minijuegos
            <ChevronRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
