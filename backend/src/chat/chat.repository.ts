import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(userId: string, participantId: string, listingId?: string, title?: string) {
    return this.prisma.conversation.create({
      data: {
        listingId,
        title,
        participants: {
          create: [
            { userId },
            { userId: participantId }
          ]
        }
      },
      include: {
        participants: { include: { user: { include: { profile: true } } } }
      }
    });
  }

  async findUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: { some: { userId } }
      },
      include: {
        participants: { include: { user: { include: { profile: true } } } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } }
      },
      orderBy: { lastMessageAt: 'desc' }
    });
  }

  async findConversationById(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: { include: { user: { include: { profile: true } } } }
      }
    });
  }

  async createMessage(conversationId: string, senderId: string, content: string, mediaUrl?: string) {
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: { conversationId, senderId, content, mediaUrl },
        include: { sender: { include: { profile: true } } }
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
          messageCount: { increment: 1 }
        }
      });

      return message;
    });
  }

  async findMessages(conversationId: string, skip = 0, take = 50) {
    return this.prisma.message.findMany({
      where: { conversationId },
      include: { sender: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });
  }
}
