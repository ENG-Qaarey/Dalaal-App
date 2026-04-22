import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateConversationDto, CreateMessageDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async createConversation(userId: string, dto: CreateConversationDto) {
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
    return this.chatRepository.findMessages(conversationId, skip, limit);
  }

  async sendMessage(conversationId: string, userId: string, dto: CreateMessageDto) {
    const conversation = await this.chatRepository.findConversationById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    const isParticipant = conversation.participants.some(p => p.userId === userId);
    if (!isParticipant) throw new ForbiddenException('Not a participant in this conversation');

    return this.chatRepository.createMessage(conversationId, userId, dto.content, dto.mediaUrl);
  }
}
