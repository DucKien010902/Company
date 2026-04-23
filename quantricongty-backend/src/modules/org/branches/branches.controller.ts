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
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { AccessTokenGuard } from '../../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ObjectIdParamDto } from '../../../common/dto/object-id-param.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthUser } from '../../../common/interfaces/auth-user.interface';

@Controller('branches')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Permissions('branches.create')
  create(@Body() dto: CreateBranchDto, @CurrentUser() currentUser?: AuthUser) {
    return this.branchesService.create(dto, currentUser?.sub);
  }

  @Get()
  @Permissions('branches.read')
  findAll(@Query() query: PaginationQueryDto) {
    return this.branchesService.findAll(query);
  }

  @Get(':id')
  @Permissions('branches.read')
  findOne(@Param() params: ObjectIdParamDto) {
    return this.branchesService.findOne(params.id);
  }

  @Patch(':id')
  @Permissions('branches.update')
  update(
    @Param() params: ObjectIdParamDto,
    @Body() dto: UpdateBranchDto,
    @CurrentUser() currentUser?: AuthUser,
  ) {
    return this.branchesService.update(params.id, dto, currentUser?.sub);
  }

  @Delete(':id')
  @Permissions('branches.delete')
  remove(@Param() params: ObjectIdParamDto, @CurrentUser() currentUser?: AuthUser) {
    return this.branchesService.remove(params.id, currentUser?.sub);
  }
}
