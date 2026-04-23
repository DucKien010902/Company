import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guards/access-token.guard';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [AccessTokenGuard, PermissionsGuard],
  exports: [AccessTokenGuard, PermissionsGuard, JwtModule],
})
export class CommonModule {}
