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
exports.ChatRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ChatRepository = class ChatRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createConversation(userId, participantId, listingId, title) {
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
    async findUserConversations(userId) {
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
    async findConversationById(id) {
        return this.prisma.conversation.findUnique({
            where: { id },
            include: {
                participants: { include: { user: { include: { profile: true } } } }
            }
        });
    }
    async createMessage(conversationId, senderId, content, mediaUrl) {
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
    async findMessages(conversationId, skip = 0, take = 50) {
        return this.prisma.message.findMany({
            where: { conversationId },
            include: { sender: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take
        });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatRepository);
//# sourceMappingURL=chat.repository.js.map