import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async create(userId: string, dto: CreateNotificationDto) {
    return this.notificationsRepository.create(userId, dto);
  }

  async getMyNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.notificationsRepository.findByUserId(userId, skip, limit);
  }

  async markAsRead(id: string) {
    return this.notificationsRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    return this.notificationsRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string) {
    return this.notificationsRepository.countUnread(userId);
  }
}
