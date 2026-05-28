# 🧠 LogicMaster - Plataforma Educativa de Lógica Proposicional

## 📋 Descripción del Proyecto

LogicMaster es una plataforma educativa interactiva y gamificada para aprender Lógica Proposicional. Desarrollada como proyecto universitario, combina teoría interactiva, minijuegos desafiantes y sistema de progresión.

## 🚀 Stack Tecnológico

### Frontend
- **React 18** + **TypeScript** - UI framework con tipado estático
- **Vite** - Build tool ultra-rápido
- **TailwindCSS** - Framework CSS utility-first
- **Framer Motion** - Animaciones fluidas
- **React Router** - Enrutamiento
- **Zustand** - State management ligero
- **React Query** - Data fetching y caching

### Backend
- **Node.js** + **Express** - Servidor API
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos
- **JWT** - Autenticación
- **Socket.io** - WebSockets para tiempo real
- **Bcrypt** - Hashing de contraseñas

## ✨ Características Implementadas

### 🎓 Academia Interactiva
- Tarjetas animadas con teoría de operadores lógicos
- Calculadora de tablas de verdad en tiempo real
- Sistema de progreso por módulos

### 🎮 Minijuegos
1. **Desactiva la Bomba Lógica** - Evalúa expresiones contra reloj
2. **El Guardián del Castillo** - Completa afirmaciones lógicas

### 🏆 Sistema de Gamificación
- XP y niveles con curva de progresión
- Leaderboards globales
- Racha de victorias con bonus multiplicadores

### 👥 Características Sociales
- Perfiles de usuario con estadísticas detalladas
- Sistema de autenticación y registro

### 📊 Analytics y Progreso
- Dashboard de progreso personal
- Estadísticas detalladas de rendimiento

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- npm

### Instalación Rápida
```bash
# Instalar dependencias del servidor
cd server
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

```bash
# En otra terminal, instalar dependencias del cliente
cd client
npm install
npm run dev
```

### Acceso
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener perfil actual

### Usuarios
- `GET /api/users/:id` - Obtener perfil de usuario
- `GET /api/users/leaderboard` - Leaderboard global

### Minijuegos
- `POST /api/games/bomba/submit` - Enviar respuesta Bomba
- `POST /api/games/guardia/submit` - Enviar respuesta Guardián

## 🎯 Estado del Proyecto

### Backend ✅
- Servidor Express con TypeScript
- Sistema de autenticación JWT
- Motor de evaluación lógica avanzado
- Sistema de gamificación (XP, niveles)
- API REST completa
- Socket.io para tiempo real
- Schema Prisma con modelos de datos

### Frontend ✅
- Aplicación React + TypeScript + Vite
- Sistema de routing protegido
- State management con Zustand
- Componentes UI base
- Páginas: Login, Register, Academia, Minijuegos, Perfil, Leaderboard
- Minijuegos: Bomba Lógica, Guardián del Castillo
- API client con Axios

## 👥 Autores

Desarrollado como proyecto universitario.

## 📄 Licencia

MIT License - Uso educativo y comercial permitido.
