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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const notifications_repository_1 = require("./notifications.repository");
let NotificationsService = class NotificationsService {
    notificationsRepository;
    constructor(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    async create(userId, dto) {
        return this.notificationsRepository.create(userId, dto);
    }
    async getMyNotifications(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.notificationsRepository.findByUserId(userId, skip, limit);
    }
    async markAsRead(id) {
        return this.notificationsRepository.markAsRead(id);
    }
    async markAllAsRead(userId) {
        return this.notificationsRepository.markAllAsRead(userId);
    }
    async getUnreadCount(userId) {
        return this.notificationsRepository.countUnread(userId);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_repository_1.NotificationsRepository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map