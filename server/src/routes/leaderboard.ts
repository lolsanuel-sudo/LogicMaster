import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/leaderboard
 * Get global leaderboard
 */
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const sortBy = (req.query.sortBy as string) || 'score';

    let orderBy: any = {};
    if (sortBy === 'score') {
      orderBy = { totalScore: 'desc' };
    } else if (sortBy === 'level') {
      orderBy = { level: 'desc' };
    } else if (sortBy === 'wins') {
      orderBy = { gamesWon: 'desc' };
    } else if (sortBy === 'streak') {
      orderBy = { maxStreak: 'desc' };
    }

    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        level: true,
        xp: true,
        totalScore: true,
        gamesPlayed: true,
        gamesWon: true,
        maxStreak: true,
      },
    });

    const total = await prisma.user.count();

    // Add rank
    const leaderboard = users.map((user, index) => ({
      ...user,
      rank: offset + index + 1,
      winRate: user.gamesPlayed > 0 
        ? Math.round((user.gamesWon / user.gamesPlayed) * 1000) / 10 
        : 0,
    }));

    res.json({
      leaderboard,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/leaderboard/:id/rank
 * Get user's rank on leaderboard
 */
router.get('/:id/rank', async (req, res) => {
  try {
    const { id } = req.params;
    const sortBy = (req.query.sortBy as string) || 'score';

    let orderBy: any = {};
    if (sortBy === 'score') {
      orderBy = { totalScore: 'desc' };
    } else if (sortBy === 'level') {
      orderBy = { level: 'desc' };
    } else if (sortBy === 'wins') {
      orderBy = { gamesWon: 'desc' };
    } else if (sortBy === 'streak') {
      orderBy = { maxStreak: 'desc' };
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        totalScore: true,
        level: true,
        gamesWon: true,
        maxStreak: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count users with higher score
    const rank = await prisma.user.count({
      where: {
        ...(sortBy === 'score' && { totalScore: { gt: user.totalScore } }),
        ...(sortBy === 'level' && { level: { gt: user.level } }),
        ...(sortBy === 'wins' && { gamesWon: { gt: user.gamesWon } }),
        ...(sortBy === 'streak' && { maxStreak: { gt: user.maxStreak } }),
      },
    });

    res.json({ rank: rank + 1 });
  } catch (error) {
    console.error('Get rank error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
