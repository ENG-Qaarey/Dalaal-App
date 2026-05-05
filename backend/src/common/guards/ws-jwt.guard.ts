import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake?.auth?.token || client.handshake?.headers?.authorization?.split(' ')[1];

    if (!token) {
      this.logger.warn(`Connection rejected: No token provided from ${client.id}`);
      return false;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      // CRITICAL: Look up user by id to ensure user exists
      const user = await this.prisma.user.findUnique({ 
        where: { id: payload.sub },
        select: { id: true, sessionToken: true }
      });
      
      if (!user) {
        this.logger.warn(`Connection rejected: User ${payload.sub} not found`);
        return false;
      }

      // CRITICAL: Verify sessionToken matches - this prevents session hijacking
      // If user A logs in, their new token won't match old token in database
      if (!payload.sessionToken || !user.sessionToken || payload.sessionToken !== user.sessionToken) {
        this.logger.warn(`Connection rejected: Session token mismatch for user ${payload.sub}`);
        return false;
      }

      // Inject user payload into socket for use in handlers
      (client as any).user = payload;
      (client as any).handshake.user = payload;
      
      this.logger.log(`User ${payload.sub} authenticated on socket ${client.id}`);
      context.switchToWs().getData().user = payload;
      return true;
    } catch (error) {
      this.logger.warn(`JWT validation failed for ${client.id}: ${error}`);
      return false;
    }
  }
}
