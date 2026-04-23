import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from '../audit/audit.module';
import { CommonModule } from '../../common/common.module';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';

@Module({
  imports: [
    CommonModule,
    AuditModule,
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [MongooseModule],
})
export class HrmModule {}
