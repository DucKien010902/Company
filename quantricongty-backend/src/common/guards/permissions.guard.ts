import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthUser } from '../interfaces/auth-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const currentUser = request.user;

    if (!currentUser) {
      throw new ForbiddenException('Authentication context was not found');
    }

    const hasAllPermissions = requiredPermissions.every((permission) =>
      currentUser.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('You do not have enough permissions');
    }

    return true;
  }
}
