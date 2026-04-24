import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class RateLimitMiddleware implements NestMiddleware {
    private requestCounts;
    private readonly windowMs;
    private readonly maxRequests;
    use(req: Request, res: Response, next: NextFunction): void;
}
