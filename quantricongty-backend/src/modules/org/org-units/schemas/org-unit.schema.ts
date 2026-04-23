import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrgUnitDocument = HydratedDocument<OrgUnit>;

export enum OrgUnitStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true, collection: 'org_units' })
export class OrgUnit {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'OrgUnit', default: null })
  parentId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Branch', default: null })
  branchId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Employee', default: null })
  managerEmployeeId?: Types.ObjectId | null;

  @Prop({ enum: OrgUnitStatus, default: OrgUnitStatus.ACTIVE })
  status!: OrgUnitStatus;
}

export const OrgUnitSchema = SchemaFactory.createForClass(OrgUnit);
