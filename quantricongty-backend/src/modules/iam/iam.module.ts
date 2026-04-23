import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from '../audit/audit.module';
import { CommonModule } from '../../common/common.module';
import { Role, RoleSchema } from './schemas/role.schema';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [
    CommonModule,
    AuditModule,
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [MongooseModule, RolesService],
})
export class IamModule {}
