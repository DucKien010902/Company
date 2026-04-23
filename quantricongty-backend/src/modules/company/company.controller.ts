import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('company')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('profile')
  @Permissions('company.read')
  getProfile() {
    return this.companyService.getProfile();
  }

  @Patch('profile')
  @Permissions('company.update')
  updateProfile(@Body() dto: UpdateCompanyDto) {
    return this.companyService.updateProfile(dto);
  }
}
