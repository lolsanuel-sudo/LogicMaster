import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OnlineUser {
  userId: string;
  username: string;
  socketId: string;
}

const onlineUsers = new Map<string, OnlineUser>();

export function setupSocketHandlers(io: SocketIOServer) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their ID
    socket.on('user:join', async (data: { userId: string; username: string }) => {
      try {
        onlineUsers.set(socket.id, {
          userId: data.userId,
          username: data.username,
          socketId: socket.id,
        });

        // Broadcast updated online count
        io.emit('users:online', {
          count: onlineUsers.size,
          users: Array.from(onlineUsers.values()).map(u => ({
            userId: u.userId,
            username: u.username,
          })),
        });

        // Update user's last seen
        await prisma.user.update({
          where: { id: data.userId },
          data: { updatedAt: new Date() },
        });
      } catch (error) {
        console.error('User join error:', error);
      }
    });

    // Multiplayer game matchmaking
    socket.on('game:matchmaking', async (data: { userId: string; gameType: string }) => {
      try {
        // Find another user looking for a match
        const opponent = Array.from(onlineUsers.values()).find(
          u => u.userId !== data.userId && !u.socketId.includes('playing')
        );

        if (opponent) {
          // Create a match
          const roomId = `game_${Date.now()}`;
          
          socket.join(roomId);
          io.sockets.sockets.get(opponent.socketId)?.join(roomId);

          io.to(roomId).emit('game:match_found', {
            roomId,
            players: [
              { userId: data.userId, socketId: socket.id },
              { userId: opponent.userId, socketId: opponent.socketId },
            ],
          });

          // Mark sockets as playing
          onlineUsers.set(socket.id, { ...onlineUsers.get(socket.id)!, socketId: `${socket.id}_playing` });
          onlineUsers.set(opponent.socketId, { ...onlineUsers.get(opponent.socketId)!, socketId: `${opponent.socketId}_playing` });
        } else {
          socket.emit('game:waiting', { message: 'Waiting for opponent...' });
        }
      } catch (error) {
        console.error('Matchmaking error:', error);
      }
    });

    // In-game chat
    socket.on('game:chat', (data: { roomId: string; message: string; userId: string; username: string }) => {
      io.to(data.roomId).emit('game:chat', {
        userId: data.userId,
        username: data.username,
        message: data.message,
        timestamp: new Date(),
      });
    });

    // Game progress updates
    socket.on('game:progress', (data: { roomId: string; userId: string; progress: number }) => {
      socket.to(data.roomId).emit('game:opponent_progress', {
        userId: data.userId,
        progress: data.progress,
      });
    });

    // Game completion
    socket.on('game:complete', async (data: { roomId: string; userId: string; won: boolean; score: number }) => {
      try {
        // Update user stats
        await prisma.user.update({
          where: { id: data.userId },
          data: {
            gamesPlayed: { increment: 1 },
            gamesWon: data.won ? { increment: 1 } : undefined,
            totalScore: { increment: data.score },
          },
        });

        io.to(data.roomId).emit('game:ended', {
          winner: data.userId,
          score: data.score,
        });

        // Leave room
        socket.leave(data.roomId);
      } catch (error) {
        console.error('Game complete error:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      onlineUsers.delete(socket.id);

      io.emit('users:online', {
        count: onlineUsers.size,
        users: Array.from(onlineUsers.values()).map(u => ({
          userId: u.userId,
          username: u.username,
        })),
      });
    });
  });
}
