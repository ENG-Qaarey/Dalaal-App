import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateConversationDto, CreateMessageDto } from './dto';
import { MessageType } from '../common/enums/message-type.enum';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async createConversation(userId: string, dto: CreateConversationDto) {
    if (userId === dto.participantId) {
      throw new BadRequestException('Cannot start a chat with yourself');
    }
    return this.chatRepository.createConversation(userId, dto.participantId, dto.listingId, dto.title);
  }

  async getConversations(userId: string) {
    return this.chatRepository.findUserConversations(userId);
  }

  async getMessages(conversationId: string, userId: string, page = 1, limit = 50) {
    const conversation = await this.chatRepository.findConversationById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    const isParticipant = conversation.participants.some(p => p.userId === userId);
    if (!isParticipant) throw new ForbiddenException('Not a participant in this conversation');

    const skip = (page - 1) * limit;
    return this.chatRepository.findMessagesForUser(conversationId, userId, skip, limit);
  }

  async getConversationById(conversationId: string, userId?: string) {
    const conversation = await this.chatRepository.findConversationById(conversationId);
    if (!conversation) return null;
    if (!userId) return conversation;

    const isParticipant = conversation.participants.some((p) => p.userId === userId);
    if (!isParticipant) {
      throw new ForbiddenException('Not a participant in this conversation');
    }
    return conversation;
  }

  async sendMessage(conversationId: string, userId: string, dto: CreateMessageDto) {
    const conversation = await this.chatRepository.findConversationById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    const isParticipant = conversation.participants.some(p => p.userId === userId);
    if (!isParticipant) throw new ForbiddenException('Not a participant in this conversation');

    const onlySelf = conversation.participants.every(p => p.userId === userId);
    if (onlySelf) throw new ForbiddenException('Cannot message yourself');

    if (!dto.content && !dto.mediaUrl) {
      throw new BadRequestException('Message content or media is required');
    }

    const type = dto.type === MessageType.SYSTEM ? MessageType.TEXT : dto.type || MessageType.TEXT;
    return this.chatRepository.createMessage(conversationId, userId, dto.content, dto.mediaUrl, type);
  }

  async createSystemMessage(conversationId: string, userId: string, content: string) {
    const conversation = await this.chatRepository.findConversationById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    const isParticipant = conversation.participants.some(p => p.userId === userId);
    if (!isParticipant) throw new ForbiddenException('Not a participant in this conversation');

    return this.chatRepository.createMessage(conversationId, userId, content, undefined, MessageType.SYSTEM);
  }

  async deleteMessage(messageId: string, userId: string, scope: 'self' | 'all') {
    const message = await this.chatRepository.findMessageById(messageId);
    if (!message) throw new NotFoundException('Message not found');

    const isParticipant = message.conversation.participants.some(p => p.userId === userId);
    if (!isParticipant) throw new ForbiddenException('Not a participant in this conversation');

    if (scope === 'all') {
      if (message.senderId !== userId) {
        throw new ForbiddenException('Only the sender can delete for everyone');
      }
      const result = await this.chatRepository.deleteMessageForAll(messageId);
      if (!result) throw new NotFoundException('Message not found');
      return { conversationId: message.conversationId };
    }

    await this.chatRepository.addDeletion(messageId, userId);
    return { conversationId: message.conversationId };
  }

  async markMessagesAsRead(conversationId: string, userId: string, messageId?: string) {
    return this.chatRepository.markAsRead(conversationId, userId, messageId);
  }
}
