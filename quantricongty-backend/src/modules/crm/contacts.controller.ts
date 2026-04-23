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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ObjectIdParamDto } from '../../common/dto/object-id-param.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/interfaces/auth-user.interface';

@Controller('contacts')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Permissions('contacts.create')
  create(@Body() dto: CreateContactDto, @CurrentUser() currentUser?: AuthUser) {
    return this.contactsService.create(dto, currentUser?.sub);
  }

  @Get()
  @Permissions('contacts.read')
  findAll(@Query() query: PaginationQueryDto) {
    return this.contactsService.findAll(query);
  }

  @Get(':id')
  @Permissions('contacts.read')
  findOne(@Param() params: ObjectIdParamDto) {
    return this.contactsService.findOne(params.id);
  }

  @Patch(':id')
  @Permissions('contacts.update')
  update(
    @Param() params: ObjectIdParamDto,
    @Body() dto: UpdateContactDto,
    @CurrentUser() currentUser?: AuthUser,
  ) {
    return this.contactsService.update(params.id, dto, currentUser?.sub);
  }

  @Delete(':id')
  @Permissions('contacts.delete')
  remove(@Param() params: ObjectIdParamDto, @CurrentUser() currentUser?: AuthUser) {
    return this.contactsService.remove(params.id, currentUser?.sub);
  }
}
