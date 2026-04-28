import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MessageType } from '../common/enums/message-type.enum';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(userId: string, participantId: string, listingId?: string, title?: string) {
    // Check if conversation already exists between these users
    const existing = await this.prisma.conversation.findFirst({
      where: {
        participants: {
          some: { userId },
        },
        listingId: listingId || null,
      },
      include: {
        participants: {
          where: { userId: participantId },
        },
      },
    });

    if (existing && existing.participants.length > 0) {
      return existing;
    }

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
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          where: { deletions: { none: { userId } } },
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });
  }

  async findMessageById(id: string) {
    return this.prisma.message.findUnique({
      where: { id },
      include: {
        conversation: { include: { participants: true } },
      },
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

  async createMessage(
    conversationId: string,
    senderId: string,
    content?: string,
    mediaUrl?: string,
    type: MessageType = MessageType.TEXT,
  ) {
    const normalizedContent = typeof content === 'string' ? content.trim() : '';
    const normalizedMediaUrl = typeof mediaUrl === 'string' ? mediaUrl.trim() : '';
    if (!normalizedContent && !normalizedMediaUrl) {
      throw new BadRequestException('Message content or media is required');
    }

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId,
          senderId,
          content: normalizedContent || undefined,
          mediaUrl: normalizedMediaUrl || undefined,
          type,
        },
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

  async findMessagesForUser(conversationId: string, userId: string, skip = 0, take = 50) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
        deletions: { none: { userId } },
      },
      include: { sender: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async addDeletion(messageId: string, userId: string) {
    return this.prisma.messageDeletion.upsert({
      where: { messageId_userId: { messageId, userId } },
      update: {},
      create: { messageId, userId },
    });
  }

  async deleteMessageForAll(messageId: string) {
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.findUnique({ where: { id: messageId } });
      if (!message) return null;

      await tx.message.delete({ where: { id: messageId } });

      const latest = await tx.message.findFirst({
        where: { conversationId: message.conversationId },
        orderBy: { createdAt: 'desc' },
      });

      const conversation = await tx.conversation.findUnique({
        where: { id: message.conversationId },
        select: { messageCount: true },
      });
      const nextMessageCount = Math.max(0, (conversation?.messageCount || 0) - 1);

      await tx.conversation.update({
        where: { id: message.conversationId },
        data: {
          lastMessageAt: latest?.createdAt ?? null,
          messageCount: nextMessageCount,
        },
      });

      return { message, latest };
    });
  }

  async markAsRead(conversationId: string, userId: string, messageId?: string) {
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId },
    });
    
    if (!participant) return;

    if (messageId) {
      await this.prisma.message.updateMany({
        where: { 
          conversationId,
          id: messageId,
          senderId: { not: userId },
        },
        data: { readAt: new Date() },
      });
    } else {
      await this.prisma.message.updateMany({
        where: { 
          conversationId,
          senderId: { not: userId },
          readAt: null,
        },
        data: { readAt: new Date() },
      });
    }

    await this.prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: { unreadCount: 0, lastReadAt: new Date() },
    });
  }
}
