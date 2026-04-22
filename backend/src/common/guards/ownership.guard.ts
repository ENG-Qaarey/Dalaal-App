import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceUserId = request.params.userId || request.params.id;

    if (user.role === 'SUPER_ADMIN' || user.role === 'MODERATOR') {
      return true;
    }

    if (resourceUserId && user.id !== resourceUserId) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
