import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Injectable()
export class ThrottleGuard implements CanActivate {
  constructor(private throttle: Throttle) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
  }
}
