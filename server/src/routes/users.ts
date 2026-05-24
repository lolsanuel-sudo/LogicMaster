import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

/**
 * GET /api/users/:id
 * Get user profile by ID
 */
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        level: true,
        xp: true,
        streak: true,
        maxStreak: true,
        gamesPlayed: true,
        gamesWon: true,
        totalScore: true,
        createdAt: true,
        achievements: {
          take: 10,
          orderBy: { unlockedAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const winRate = user.gamesPlayed > 0 
      ? (user.gamesWon / user.gamesPlayed) * 100 
      : 0;

    res.json({
      ...user,
      winRate: Math.round(winRate * 10) / 10,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/users/:id
 * Update user profile (only own profile)
 */
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (req.userId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/users/:id/stats
 * Get detailed user statistics
 */
router.get('/:id/stats', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        gameSessions: {
          orderBy: { completedAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate statistics by game type
    const statsByGameType = user.gameSessions.reduce((acc, session) => {
      if (!acc[session.gameType]) {
        acc[session.gameType] = {
          played: 0,
          won: 0,
          totalScore: 0,
        };
      }
      acc[session.gameType].played++;
      if (session.won) acc[session.gameType].won++;
      acc[session.gameType].totalScore += session.score;
      return acc;
    }, {} as Record<string, { played: number; won: number; totalScore: number }>);

    res.json({
      overall: {
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
        winRate: user.gamesPlayed > 0 
          ? Math.round((user.gamesWon / user.gamesPlayed) * 1000) / 10 
          : 0,
        totalScore: user.totalScore,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        maxStreak: user.maxStreak,
      },
      byGameType: statsByGameType,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
