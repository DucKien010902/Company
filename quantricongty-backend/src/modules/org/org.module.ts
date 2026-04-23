import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from '../audit/audit.module';
import { CommonModule } from '../../common/common.module';
import { Branch, BranchSchema } from './branches/schemas/branch.schema';
import { OrgUnit, OrgUnitSchema } from './org-units/schemas/org-unit.schema';
import { Position, PositionSchema } from './positions/schemas/position.schema';
import { Role, RoleSchema } from '../iam/schemas/role.schema';
import { BranchesService } from './branches/branches.service';
import { BranchesController } from './branches/branches.controller';
import { OrgUnitsService } from './org-units/org-units.service';
import { OrgUnitsController } from './org-units/org-units.controller';
import { PositionsService } from './positions/positions.service';
import { PositionsController } from './positions/positions.controller';

@Module({
  imports: [
    CommonModule,
    AuditModule,
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: OrgUnit.name, schema: OrgUnitSchema },
      { name: Position.name, schema: PositionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [BranchesController, OrgUnitsController, PositionsController],
  providers: [BranchesService, OrgUnitsService, PositionsService],
  exports: [MongooseModule],
})
export class OrgModule {}
