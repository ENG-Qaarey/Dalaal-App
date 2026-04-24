"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
let RateLimitMiddleware = class RateLimitMiddleware {
    requestCounts = new Map();
    windowMs = 60000;
    maxRequests = 100;
    use(req, res, next) {
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
            throw new common_1.HttpException('Too many requests, please try again later', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        next();
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)()
], RateLimitMiddleware);
//# sourceMappingURL=rate-limit.middleware.js.map