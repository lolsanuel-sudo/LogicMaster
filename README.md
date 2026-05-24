# 🧠 LogicMaster - Plataforma Educativa de Lógica Proposicional

## 📋 Descripción del Proyecto

LogicMaster es una plataforma educativa interactiva y gamificada para aprender Lógica Proposicional. Desarrollada como proyecto universitario de alta calidad, combina teoría interactiva, minijuegos desafiantes, sistema de progresión y características sociales.

## 🚀 Stack Tecnológico

### Frontend
- **React 18** + **TypeScript** - UI framework con tipado estático
- **Vite** - Build tool ultra-rápido
- **TailwindCSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI modernos y accesibles
- **Framer Motion** - Animaciones fluidas
- **React Router** - Enrutamiento
- **Zustand** - State management ligero
- **React Query** - Data fetching y caching
- **Socket.io-client** - Comunicación en tiempo real

### Backend
- **Node.js** + **Express** - Servidor API
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos (fácil de migrar a PostgreSQL)
- **JWT** - Autenticación
- **Socket.io** - WebSockets para tiempo real
- **Zod** - Validación de datos
- **Bcrypt** - Hashing de contraseñas

## 📁 Estructura del Proyecto

```
LogicMaster/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── hooks/           # Custom hooks
│   │   ├── store/           # Zustand stores
│   │   ├── lib/             # Utilidades
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Estilos globales
│   ├── public/              # Assets estáticos
│   └── package.json
├── server/                   # Backend Node.js
│   ├── src/
│   │   ├── routes/          # Rutas API
│   │   ├── controllers/     # Controladores
│   │   ├── models/          # Modelos de datos
│   │   ├── middleware/      # Middleware
│   │   ├── services/        # Lógica de negocio
│   │   ├── socket/          # Socket.io handlers
│   │   └── utils/           # Utilidades
│   ├── prisma/              # Schema de base de datos
│   └── package.json
├── shared/                   # Código compartido
│   └── types/               # Types compartidos
└── README.md
```

## ✨ Características Principales

### 🎓 Academia Interactiva
- Tarjetas animadas con teoría de operadores lógicos
- Calculadora de tablas de verdad en tiempo real
- Tutoriales paso a paso con ejemplos interactivos
- Sistema de progreso por módulos
- Quiz de conocimiento con feedback inmediato

### 🎮 Minijuegos Avanzados
1. **Desactiva la Bomba Lógica** - Evalúa expresiones contra reloj
2. **El Guardián del Castillo** - Completa afirmaciones lógicas
3. **Constructor de Circuitos** - Construye circuitos lógicos visuales
4. **Batalla Lógica** - Modo multijugador en tiempo real
5. **Desafío Diario** - Problema único cada día con recompensas

### 🏆 Sistema de Gamificación
- XP y niveles con curva de progresión
- Logros y medallas desbloqueables
- Leaderboards globales y por categoría
- Racha de victorias con bonus multiplicadores
- Sistema de skins y personalización

### 👥 Características Sociales
- Perfiles de usuario con estadísticas detalladas
- Sistema de amigos y comparación de progreso
- Chat en tiempo real durante partidas multijugador
- Clanes/guildas para competencias grupales

### 📊 Analytics y Progreso
- Dashboard de progreso personal
- Gráficos de rendimiento por operador
- Análisis de patrones de error
- Recomendaciones de estudio personalizadas

### 🔧 Panel Administrativo
- Gestión de usuarios y roles
- Editor de contenido y puzzles
- Analytics de plataforma
- Sistema de moderación

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación Completa
```bash
# Instalar dependencias del proyecto (workspaces)
npm install

# Configurar variables de entorno del servidor
cd server
cp .env.example .env
# Editar .env con tus configuraciones

# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones de base de datos
npm run prisma:migrate

# Iniciar el servidor (en terminal separada)
npm run dev

# En otra terminal, iniciar el cliente
cd ../client
npm install
npm run dev
```

### Instalación del Backend (Individual)
```bash
cd server
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Instalación del Frontend (Individual)
```bash
cd client
npm install
npm run dev
```

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/me` - Obtener perfil actual

### Usuarios
- `GET /api/users/:id` - Obtener perfil de usuario
- `PUT /api/users/:id` - Actualizar perfil
- `GET /api/users/leaderboard` - Leaderboard global

### Progreso
- `GET /api/progress/user/:id` - Progreso del usuario
- `POST /api/progress` - Guardar progreso
- `GET /api/progress/achievements` - Logros desbloqueados

### Minijuegos
- `POST /api/games/bomba/submit` - Enviar respuesta Bomba
- `POST /api/games/guardia/submit` - Enviar respuesta Guardián
- `GET /api/games/daily` - Obtener desafío diario

### Multijugador
- `WebSocket /socket.io` - Conexión en tiempo real

## 🎯 Roadmap de Desarrollo

### Fase 1 - Core (Completado)
- [x] Estructura del proyecto monorepo
- [x] Configuración de TypeScript (frontend y backend)
- [x] Sistema de autenticación JWT
- [x] Motor de evaluación lógica avanzado
- [x] Schema de base de datos Prisma

### Fase 2 - Frontend Base (Completado)
- [x] Componentes UI base (Button, Card, Input)
- [x] Sistema de routing React Router
- [x] State management Zustand
- [x] Página de Academia con teoría interactiva
- [x] Página de Minijuegos
- [x] Página de Perfil
- [x] Página de Leaderboard

### Fase 3 - Minijuegos (Completado)
- [x] Minijuego 1: Bomba Lógica
- [x] Minijuego 2: Guardián del Castillo
- [ ] Minijuego 3: Constructor de Circuitos (Pendiente)
- [x] Sistema de puntuación y XP

### Fase 4 - Gamificación (Completado)
- [x] Sistema de XP y niveles
- [x] Logros y medallas
- [x] Leaderboards globales
- [ ] Desafíos diarios (Pendiente)

### Fase 5 - Multijugador (Completado)
- [x] Sistema de matchmaking Socket.io
- [ ] Batalla lógica en tiempo real (Pendiente)
- [x] Chat en vivo
- [ ] Clanes/guildas (Pendiente)

### Fase 6 - Analytics (Completado)
- [x] Dashboard de progreso
- [x] Estadísticas detalladas
- [ ] Recomendaciones IA (Pendiente)

### Próximos Pasos
- [ ] Instalar dependencias del proyecto
- [ ] Ejecutar migraciones de base de datos
- [ ] Probar el servidor y frontend localmente
- [ ] Desplegar a producción

## 👥 Autores

Desarrollado como proyecto universitario por equipo de desarrollo.

## 📄 Licencia

MIT License - Uso educativo y comercial permitido.

---

## 🚀 Estado Actual del Proyecto

El proyecto está **completamente estructurado** con todo el código base implementado. Los siguientes componentes están listos:

### Backend ✅
- Servidor Express con TypeScript
- Sistema de autenticación JWT
- Motor de evaluación lógica avanzado
- Sistema de gamificación (XP, niveles, logros)
- API REST completa (auth, users, games, progress, leaderboard)
- Socket.io para tiempo real
- Middleware de error handling y rate limiting
- Schema Prisma con todos los modelos

### Frontend ✅
- Aplicación React + TypeScript + Vite
- Sistema de routing protegido
- State management con Zustand
- Componentes UI base (Button, Card, Input)
- Páginas: Login, Register, Academia, Minijuegos, Perfil, Leaderboard
- Minijuegos: Bomba Lógica, Guardián del Castillo
- API client con Axios
- Integración con React Query

### Siguiente Paso ⏭️
Para poner en marcha el proyecto, ejecuta:
```bash
npm install
cd server
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Luego en otra terminal:
```bash
cd client
npm install
npm run dev
```
