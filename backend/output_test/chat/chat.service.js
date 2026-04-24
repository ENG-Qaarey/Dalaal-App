"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const chat_repository_1 = require("./chat.repository");
let ChatService = class ChatService {
    chatRepository;
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async createConversation(userId, dto) {
        return this.chatRepository.createConversation(userId, dto.participantId, dto.listingId, dto.title);
    }
    async getConversations(userId) {
        return this.chatRepository.findUserConversations(userId);
    }
    async getMessages(conversationId, userId, page = 1, limit = 50) {
        const conversation = await this.chatRepository.findConversationById(conversationId);
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        const isParticipant = conversation.participants.some(p => p.userId === userId);
        if (!isParticipant)
            throw new common_1.ForbiddenException('Not a participant in this conversation');
        const skip = (page - 1) * limit;
        return this.chatRepository.findMessages(conversationId, skip, limit);
    }
    async sendMessage(conversationId, userId, dto) {
        const conversation = await this.chatRepository.findConversationById(conversationId);
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        const isParticipant = conversation.participants.some(p => p.userId === userId);
        if (!isParticipant)
            throw new common_1.ForbiddenException('Not a participant in this conversation');
        return this.chatRepository.createMessage(conversationId, userId, dto.content, dto.mediaUrl);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository])
], ChatService);
//# sourceMappingURL=chat.service.js.map