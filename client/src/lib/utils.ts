import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0
  return Math.round((wins / total) * 100)
}

export function getDifficultyColor(difficulty: number): string {
  switch (difficulty) {
    case 1:
      return 'text-green-500'
    case 2:
      return 'text-yellow-500'
    case 3:
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

export function getDifficultyLabel(difficulty: number): string {
  switch (difficulty) {
    case 1:
      return 'Fácil'
    case 2:
      return 'Medio'
    case 3:
      return 'Difícil'
    default:
      return 'Desconocido'
  }
}
