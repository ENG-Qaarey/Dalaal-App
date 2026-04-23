import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottleGuard extends ThrottlerGuard {}
