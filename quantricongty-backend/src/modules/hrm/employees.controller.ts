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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ObjectIdParamDto } from '../../common/dto/object-id-param.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/interfaces/auth-user.interface';

@Controller('employees')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Permissions('employees.create')
  create(@Body() dto: CreateEmployeeDto, @CurrentUser() currentUser?: AuthUser) {
    return this.employeesService.create(dto, currentUser?.sub);
  }

  @Get()
  @Permissions('employees.read')
  findAll(@Query() query: PaginationQueryDto) {
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  @Permissions('employees.read')
  findOne(@Param() params: ObjectIdParamDto) {
    return this.employeesService.findOne(params.id);
  }

  @Patch(':id')
  @Permissions('employees.update')
  update(
    @Param() params: ObjectIdParamDto,
    @Body() dto: UpdateEmployeeDto,
    @CurrentUser() currentUser?: AuthUser,
  ) {
    return this.employeesService.update(params.id, dto, currentUser?.sub);
  }

  @Delete(':id')
  @Permissions('employees.delete')
  remove(@Param() params: ObjectIdParamDto, @CurrentUser() currentUser?: AuthUser) {
    return this.employeesService.remove(params.id, currentUser?.sub);
  }
}
