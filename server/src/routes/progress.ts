import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/progress/user/:id
 * Get user progress
 */
router.get('/user/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (req.userId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        achievements: {
          orderBy: { unlockedAt: 'desc' },
        },
        gameSessions: {
          orderBy: { completedAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate progress by operator
    const operatorProgress = {
      AND: { correct: 0, total: 0 },
      OR: { correct: 0, total: 0 },
      NOT: { correct: 0, total: 0 },
      XOR: { correct: 0, total: 0 },
      IMPLIES: { correct: 0, total: 0 },
      EQUIVALENT: { correct: 0, total: 0 },
    };

    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        maxStreak: user.maxStreak,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
        totalScore: user.totalScore,
      },
      achievements: user.achievements,
      recentGames: user.gameSessions,
      operatorProgress,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/progress/achievements
 * Get all available achievements
 */
router.get('/achievements', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const userAchievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
    });

    const allAchievements = GamificationService.getAllAchievements();

    const unlockedIds = new Set(userAchievements.map(a => a.title));

    const achievements = allAchievements.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.title),
      unlockedAt: userAchievements.find(a => a.title === achievement.title)?.unlockedAt,
    }));

    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
