/**
 * Sistema de Gamificación Avanzado
 * 
 * Gestiona:
 * - Cálculo de XP y niveles
 * - Sistema de logros
 * - Bonus por racha
 * - Recompensas diarias
 */

export interface GamificationConfig {
  baseXP: number;
  streakMultiplier: number;
  levelUpXP: number;
  dailyBonusXP: number;
}

export interface Achievement {
  id: string;
  type: 'streak' | 'score' | 'games' | 'special';
  title: string;
  description: string;
  icon: string;
  requirement: number;
  xpReward: number;
}

export class GamificationService {
  private static config: GamificationConfig = {
    baseXP: 10,
    streakMultiplier: 2,
    levelUpXP: 100,
    dailyBonusXP: 50,
  };

  private static achievements: Achievement[] = [
    {
      id: 'first_win',
      type: 'games',
      title: 'Primera Victoria',
      description: 'Gana tu primer juego',
      icon: '🏆',
      requirement: 1,
      xpReward: 20,
    },
    {
      id: 'streak_5',
      type: 'streak',
      title: 'En Racha',
      description: 'Consigue 5 victorias seguidas',
      icon: '🔥',
      requirement: 5,
      xpReward: 50,
    },
    {
      id: 'streak_10',
      type: 'streak',
      title: 'Imparable',
      description: 'Consigue 10 victorias seguidas',
      icon: '⚡',
      requirement: 10,
      xpReward: 100,
    },
    {
      id: 'score_100',
      type: 'score',
      title: 'Centenar',
      description: 'Alcanza 100 puntos',
      icon: '💯',
      requirement: 100,
      xpReward: 30,
    },
    {
      id: 'score_500',
      type: 'score',
      title: 'Quinientos',
      description: 'Alcanza 500 puntos',
      icon: '🎯',
      requirement: 500,
      xpReward: 75,
    },
    {
      id: 'games_10',
      type: 'games',
      title: 'Veterano',
      description: 'Juega 10 partidas',
      icon: '🎮',
      requirement: 10,
      xpReward: 40,
    },
    {
      id: 'games_50',
      type: 'games',
      title: 'Maestro',
      description: 'Juega 50 partidas',
      icon: '👑',
      requirement: 50,
      xpReward: 100,
    },
    {
      id: 'perfect_game',
      type: 'special',
      title: 'Perfección',
      description: 'Completa un juego sin errores',
      icon: '⭐',
      requirement: 1,
      xpReward: 50,
    },
  ];

  /**
   * Calcula el XP ganado en una partida
   */
  static calculateXP(won: boolean, streak: number, perfect: boolean = false): number {
    let xp = won ? this.config.baseXP : 0;
    
    // Bonus por racha
    if (won && streak > 0) {
      xp += Math.min(streak * this.config.streakMultiplier, 50);
    }
    
    // Bonus por juego perfecto
    if (perfect) {
      xp += 20;
    }
    
    return xp;
  }

  /**
   * Calcula el nivel basado en XP total
   */
  static calculateLevel(xp: number): number {
    return Math.floor(xp / this.config.levelUpXP) + 1;
  }

  /**
   * Calcula el XP necesario para el siguiente nivel
   */
  static xpToNextLevel(currentXP: number): number {
    const currentLevel = this.calculateLevel(currentXP);
    return (currentLevel * this.config.levelUpXP) - currentXP;
  }

  /**
   * Verifica si se desbloquea un logro
   */
  static checkAchievements(
    type: Achievement['type'],
    value: number
  ): Achievement[] {
    return this.achievements.filter(
      achievement => achievement.type === type && value >= achievement.requirement
    );
  }

  /**
   * Obtiene todos los logros disponibles
   */
  static getAllAchievements(): Achievement[] {
    return this.achievements;
  }

  /**
   * Obtiene un logro por ID
   */
  static getAchievementById(id: string): Achievement | undefined {
    return this.achievements.find(a => a.id === id);
  }

  /**
   * Calcula la dificultad basada en el nivel del jugador
   */
  static calculateDifficulty(level: number): 1 | 2 | 3 {
    if (level < 5) return 1;
    if (level < 15) return 2;
    return 3;
  }

  /**
   * Calcula el bonus diario por login consecutivo
   */
  static calculateDailyBonus(consecutiveDays: number): number {
    return Math.min(consecutiveDays * 10, 100);
  }

  /**
   * Genera una recompensa aleatoria
   */
  static generateRandomReward(level: number): {
    xp: number;
    coins?: number;
    item?: string;
  } {
    const baseReward = level * 5;
    const xp = baseReward + Math.floor(Math.random() * 20);
    
    // 30% de probabilidad de monedas adicionales
    if (Math.random() < 0.3) {
      return {
        xp,
        coins: Math.floor(Math.random() * 50) + 10,
      };
    }
    
    return { xp };
  }
}
