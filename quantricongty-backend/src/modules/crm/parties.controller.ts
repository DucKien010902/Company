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
import { PartiesService } from './parties.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ObjectIdParamDto } from '../../common/dto/object-id-param.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/interfaces/auth-user.interface';

@Controller('parties')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @Post()
  @Permissions('parties.create')
  create(@Body() dto: CreatePartyDto, @CurrentUser() currentUser?: AuthUser) {
    return this.partiesService.create(dto, currentUser?.sub);
  }

  @Get()
  @Permissions('parties.read')
  findAll(@Query() query: PaginationQueryDto) {
    return this.partiesService.findAll(query);
  }

  @Get(':id')
  @Permissions('parties.read')
  findOne(@Param() params: ObjectIdParamDto) {
    return this.partiesService.findOne(params.id);
  }

  @Patch(':id')
  @Permissions('parties.update')
  update(
    @Param() params: ObjectIdParamDto,
    @Body() dto: UpdatePartyDto,
    @CurrentUser() currentUser?: AuthUser,
  ) {
    return this.partiesService.update(params.id, dto, currentUser?.sub);
  }

  @Delete(':id')
  @Permissions('parties.delete')
  remove(@Param() params: ObjectIdParamDto, @CurrentUser() currentUser?: AuthUser) {
    return this.partiesService.remove(params.id, currentUser?.sub);
  }
}
