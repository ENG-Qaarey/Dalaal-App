import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  private readonly windowMs = 60000;
  private readonly maxRequests = 100;

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress;
    const now = Date.now();
    const key = ip || 'unknown';

    let record = this.requestCounts.get(key);

    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + this.windowMs };
      this.requestCounts.set(key, record);
    }

    record.count++;

    res.setHeader('X-RateLimit-Limit', this.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - record.count));

    if (record.count > this.maxRequests) {
      throw new HttpException(
        'Too many requests, please try again later',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }
}
