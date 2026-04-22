import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleFavorite(userId: string, listingId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: { userId_listingId: { userId, listingId } },
      });
      await this.prisma.listing.update({
        where: { id: listingId },
        data: { favoriteCount: { decrement: 1 } },
      });
      return { favorited: false };
    } else {
      await this.prisma.favorite.create({
        data: { userId, listingId },
      });
      await this.prisma.listing.update({
        where: { id: listingId },
        data: { favoriteCount: { increment: 1 } },
      });
      return { favorited: true };
    }
  }

  async getMyFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { listing: { include: { images: { take: 1 } } } },
    });
  }
}
