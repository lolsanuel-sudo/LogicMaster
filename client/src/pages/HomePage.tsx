import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            🧠 LogicMaster
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-2xl">
            Aprende Lógica Proposicional de forma interactiva y gamificada
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/academia">
              <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg">
                Comenzar Gratis
              </Button>
            </Link>
            <Link to="/minijuegos">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg">
                Jugar Ahora
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-2">Academia Interactiva</h3>
              <p className="text-blue-200">
                Aprende operadores lógicos con tarjetas animadas y ejemplos prácticos
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-2">Minijuegos Desafiantes</h3>
              <p className="text-blue-200">
                Pon a prueba tus conocimientos con juegos como Bomba Lógica y Guardián del Castillo
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">Sistema de Gamificación</h3>
              <p className="text-blue-200">
                Gana XP, desbloquea logros y compite en los leaderboards globales
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-16 max-w-3xl">
            <h2 className="text-3xl font-bold text-white mb-8">Características Principales</h2>
            <ul className="text-left text-blue-200 space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-2xl">✓</span>
                <span>Calculadora de tablas de verdad en tiempo real</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-2xl">✓</span>
                <span>Sistema de progresión por módulos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-2xl">✓</span>
                <span>Modo multijugador en tiempo real</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-2xl">✓</span>
                <span>Dashboard de progreso personal</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-2xl">✓</span>
                <span>Desafíos diarios con recompensas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-blue-200">
          <p>© 2026 LogicMaster - Plataforma Educativa de Lógica Proposicional</p>
        </div>
      </div>
    </div>
  )
}
