import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { AttendanceService } from './attendance.service';
import {
  AttendanceDailyQueryDto,
  AttendanceMonthlyQueryDto,
  AttendanceUsersQueryDto,
} from './dto/attendance-query.dto';

@Controller('attendance')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('users')
  @Permissions('attendance.read')
  findUsers(@Query() query: AttendanceUsersQueryDto) {
    return this.attendanceService.findUsers(query);
  }

  @Get('monthly')
  @Permissions('attendance.read')
  getMonthly(@Query() query: AttendanceMonthlyQueryDto) {
    return this.attendanceService.getMonthly(query);
  }

  @Get('daily')
  @Permissions('attendance.read')
  getDaily(@Query() query: AttendanceDailyQueryDto) {
    return this.attendanceService.getDaily(query);
  }
}
