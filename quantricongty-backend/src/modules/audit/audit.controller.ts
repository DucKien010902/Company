import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('audit-logs')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Permissions('audit.read')
  findLatest(@Query('limit') limit?: string) {
    return this.auditService.findLatest(Number(limit ?? 50));
  }
}
