import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token || client.handshake?.headers?.authorization?.split(' ')[1];

    if (!token) return false;

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return false;

      if (!payload.sessionToken || !user.sessionToken || payload.sessionToken !== user.sessionToken) {
        return false;
      }

      context.switchToWs().getData().user = payload;
      return true;
    } catch {
      return false;
    }
  }
}
