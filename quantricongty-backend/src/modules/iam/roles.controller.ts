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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ObjectIdParamDto } from '../../common/dto/object-id-param.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/interfaces/auth-user.interface';

@Controller('roles')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions('roles.create')
  create(@Body() dto: CreateRoleDto, @CurrentUser() currentUser?: AuthUser) {
    return this.rolesService.create(dto, currentUser?.sub);
  }

  @Get()
  @Permissions('roles.read')
  findAll(@Query() query: PaginationQueryDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @Permissions('roles.read')
  findOne(@Param() params: ObjectIdParamDto) {
    return this.rolesService.findOne(params.id);
  }

  @Patch(':id')
  @Permissions('roles.update')
  update(
    @Param() params: ObjectIdParamDto,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() currentUser?: AuthUser,
  ) {
    return this.rolesService.update(params.id, dto, currentUser?.sub);
  }

  @Delete(':id')
  @Permissions('roles.delete')
  remove(@Param() params: ObjectIdParamDto, @CurrentUser() currentUser?: AuthUser) {
    return this.rolesService.remove(params.id, currentUser?.sub);
  }
}
