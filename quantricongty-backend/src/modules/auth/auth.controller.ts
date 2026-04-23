import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { BootstrapOwnerDto } from './dto/bootstrap-owner.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('bootstrap')
  bootstrap(@Body() dto: BootstrapOwnerDto) {
    return this.authService.bootstrapOwner(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('permission-catalog')
  getPermissionCatalog() {
    return this.authService.getPermissionCatalog();
  }
}
