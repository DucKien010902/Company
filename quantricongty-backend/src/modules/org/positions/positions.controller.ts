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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { AccessTokenGuard } from '../../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ObjectIdParamDto } from '../../../common/dto/object-id-param.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthUser } from '../../../common/interfaces/auth-user.interface';

@Controller('positions')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @Permissions('positions.create')
  create(@Body() dto: CreatePositionDto, @CurrentUser() currentUser?: AuthUser) {
    return this.positionsService.create(dto, currentUser?.sub);
  }

  @Get()
  @Permissions('positions.read')
  findAll(@Query() query: PaginationQueryDto) {
    return this.positionsService.findAll(query);
  }

  @Get(':id')
  @Permissions('positions.read')
  findOne(@Param() params: ObjectIdParamDto) {
    return this.positionsService.findOne(params.id);
  }

  @Patch(':id')
  @Permissions('positions.update')
  update(
    @Param() params: ObjectIdParamDto,
    @Body() dto: UpdatePositionDto,
    @CurrentUser() currentUser?: AuthUser,
  ) {
    return this.positionsService.update(params.id, dto, currentUser?.sub);
  }

  @Delete(':id')
  @Permissions('positions.delete')
  remove(@Param() params: ObjectIdParamDto, @CurrentUser() currentUser?: AuthUser) {
    return this.positionsService.remove(params.id, currentUser?.sub);
  }
}
