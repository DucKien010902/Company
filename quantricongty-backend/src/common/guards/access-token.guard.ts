import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthUser } from '../interfaces/auth-user.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing access token');
    }

    const token = authHeader.slice(7);

    try {
      const payload = await this.jwtService.verifyAsync<AuthUser>(token, {
        secret: this.configService.get<string>('app.jwtAccessSecret'),
      });

      request.user = payload;
      return true;
    } catch (_error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
