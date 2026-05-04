import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../../common/common.module';
import {
  AttendanceData,
  AttendanceDataSchema,
} from './schemas/attendance-data.schema';
import {
  UserAttendance,
  UserAttendanceSchema,
} from './schemas/user-attendance.schema';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      { name: UserAttendance.name, schema: UserAttendanceSchema },
      { name: AttendanceData.name, schema: AttendanceDataSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
