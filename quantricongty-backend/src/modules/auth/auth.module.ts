import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Account, AccountSchema } from './schemas/account.schema';
import { Role, RoleSchema } from '../iam/schemas/role.schema';
import { Company, CompanySchema } from '../company/schemas/company.schema';
import { Employee, EmployeeSchema } from '../hrm/schemas/employee.schema';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    ConfigModule,
    AuditModule,
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Employee.name, schema: EmployeeSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtAccessSecret'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, MongooseModule],
})
export class AuthModule {}
