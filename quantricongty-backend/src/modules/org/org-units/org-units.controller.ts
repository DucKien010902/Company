import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrgUnitsService } from './org-units.service';
import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
import { UpdateOrgUnitDto } from './dto/update-org-unit.dto';
import { AccessTokenGuard } from '../../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ObjectIdParamDto } from '../../../common/dto/object-id-param.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthUser } from '../../../common/interfaces/auth-user.interface';

@Controller('org-units')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class OrgUnitsController {
  constructor(private readonly orgUnitsService: OrgUnitsService) {}

  @Post()
  @Permissions('orgUnits.create')
  create(@Body() dto: CreateOrgUnitDto, @CurrentUser() currentUser?: AuthUser) {
    return this.orgUnitsService.create(dto, currentUser?.sub);
  }

  @Get()
  @Permissions('orgUnits.read')
  findAll(@Query() query: PaginationQueryDto) {
    return this.orgUnitsService.findAll(query);
  }

  @Get(':id')
  @Permissions('orgUnits.read')
  findOne(@Param() params: ObjectIdParamDto) {
    return this.orgUnitsService.findOne(params.id);
  }

  @Patch(':id')
  @Permissions('orgUnits.update')
  update(
    @Param() params: ObjectIdParamDto,
    @Body() dto: UpdateOrgUnitDto,
    @CurrentUser() currentUser?: AuthUser,
  ) {
    return this.orgUnitsService.update(params.id, dto, currentUser?.sub);
  }

  @Delete(':id')
  @Permissions('orgUnits.delete')
  remove(@Param() params: ObjectIdParamDto, @CurrentUser() currentUser?: AuthUser) {
    return this.orgUnitsService.remove(params.id, currentUser?.sub);
  }
}
