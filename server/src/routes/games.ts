import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { LogicEngine } from '../services/logicEngine';
import { GamificationService } from '../services/gamification';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const bombaSubmitSchema = z.object({
  expression: z.string(),
  values: z.record(z.boolean()),
  answer: z.boolean(),
  duration: z.number(),
});

const guardiaSubmitSchema = z.object({
  question: z.string(),
  answer: z.string(),
  duration: z.number(),
});

/**
 * POST /api/games/bomba/submit
 * Submit answer for Bomba game
 */
router.post('/bomba/submit', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const data = bombaSubmitSchema.parse(req.body);

    // Evaluate the expression
    const correctAnswer = LogicEngine.evaluate(data.expression, data.values);
    const won = data.answer === correctAnswer;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate XP
    const xp = GamificationService.calculateXP(won, user.streak);

    // Update user stats
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        gamesPlayed: { increment: 1 },
        gamesWon: won ? { increment: 1 } : undefined,
        totalScore: won ? { increment: data.duration } : { decrement: 5 },
        streak: won ? { increment: 1 } : 0,
        maxStreak: won && user.streak + 1 > user.maxStreak 
          ? user.streak + 1 
          : undefined,
        xp: { increment: xp },
        level: GamificationService.calculateLevel(user.xp + xp),
      },
    });

    // Record game session
    await prisma.gameSession.create({
      data: {
        userId,
        gameType: 'bomba',
        score: won ? data.duration : 0,
        won,
        duration: data.duration,
        difficulty: GamificationService.calculateDifficulty(user.level),
      },
    });

    // Check for achievements
    const newAchievements = GamificationService.checkAchievements(
      won ? 'streak' : 'games',
      won ? updatedUser.streak : updatedUser.gamesPlayed
    );

    // Unlock new achievements
    for (const achievement of newAchievements) {
      const existing = await prisma.achievement.findFirst({
        where: {
          userId,
          type: achievement.type,
          title: achievement.title,
        },
      });

      if (!existing) {
        await prisma.achievement.create({
          data: {
            userId,
            type: achievement.type,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
          },
        });
      }
    }

    res.json({
      won,
      correctAnswer,
      xp,
      newLevel: updatedUser.level,
      streak: updatedUser.streak,
      newAchievements: newAchievements.map(a => ({
        title: a.title,
        icon: a.icon,
        xpReward: a.xpReward,
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Bomba submit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/games/guardia/submit
 * Submit answer for Guardia game
 */
router.post('/guardia/submit', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const data = guardiaSubmitSchema.parse(req.body);

    // Validate answer (simplified validation)
    const correctAnswers: Record<string, string> = {
      'True OR ___ = True': 'True',
      'False AND ___ = False': 'True',
      'NOT True = ___': 'False',
      'True AND ___ = True': 'True',
      'True ___ False = True': 'or',
      'True ___ True = False': 'xor',
      'False ___ False = False': 'and',
      'True ___ True = True': 'and',
    };

    const correctAnswer = correctAnswers[data.question] || 'True';
    const won = data.answer === correctAnswer;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate XP
    const xp = GamificationService.calculateXP(won, user.streak);

    // Update user stats
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        gamesPlayed: { increment: 1 },
        gamesWon: won ? { increment: 1 } : undefined,
        totalScore: won ? { increment: 15 } : { decrement: 5 },
        streak: won ? { increment: 1 } : 0,
        maxStreak: won && user.streak + 1 > user.maxStreak 
          ? user.streak + 1 
          : undefined,
        xp: { increment: xp },
        level: GamificationService.calculateLevel(user.xp + xp),
      },
    });

    // Record game session
    await prisma.gameSession.create({
      data: {
        userId,
        gameType: 'guardia',
        score: won ? 15 : 0,
        won,
        duration: data.duration,
        difficulty: GamificationService.calculateDifficulty(user.level),
      },
    });

    res.json({
      won,
      correctAnswer,
      xp,
      newLevel: updatedUser.level,
      streak: updatedUser.streak,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Guardia submit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/games/generate
 * Generate a new game puzzle
 */
router.get('/generate', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const gameType = req.query.type as string;
    const difficulty = parseInt(req.query.difficulty as string) || 1;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const actualDifficulty = GamificationService.calculateDifficulty(user.level);

    if (gameType === 'bomba') {
      const { expression, values } = LogicEngine.generateRandomExpression(
        2 + actualDifficulty,
        actualDifficulty
      );
      res.json({ expression, values, difficulty: actualDifficulty });
    } else if (gameType === 'guardia') {
      // Simplified puzzle generation
      const puzzles = [
        { question: 'True OR ___ = True', options: ['True', 'False'], answer: 'True' },
        { question: 'NOT True = ___', options: ['True', 'False'], answer: 'False' },
        { question: 'True ___ False = True', options: ['and', 'or'], answer: 'or' },
      ];
      const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      res.json({ ...puzzle, difficulty: actualDifficulty });
    } else {
      res.status(400).json({ error: 'Invalid game type' });
    }
  } catch (error) {
    console.error('Generate game error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
