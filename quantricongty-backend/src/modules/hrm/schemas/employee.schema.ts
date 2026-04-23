import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum WorkStatus {
  ACTIVE = 'active',
  ONBOARDING = 'onboarding',
  SUSPENDED = 'suspended',
  RESIGNED = 'resigned',
}

@Schema({ _id: false })
export class EmergencyContact {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop()
  relation?: string;
}

const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);

@Schema({ timestamps: true, collection: 'employees' })
export class Employee {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  employeeCode!: string;

  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  normalizedFullName!: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ enum: Gender })
  gender?: Gender;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ trim: true })
  nationalId?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ type: [EmergencyContactSchema], default: [] })
  emergencyContacts!: EmergencyContact[];

  @Prop({ type: Types.ObjectId, ref: 'Account', default: null })
  accountId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Branch', default: null })
  branchId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'OrgUnit', default: null })
  orgUnitId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Position', default: null })
  positionId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Employee', default: null })
  managerEmployeeId?: Types.ObjectId | null;

  @Prop({ trim: true })
  employmentType?: string;

  @Prop({ enum: WorkStatus, default: WorkStatus.ONBOARDING })
  workStatus!: WorkStatus;

  @Prop({type: Date, default: null })
  hireDate?: Date | null;

  @Prop({type: Date, default: null })
  leaveDate?: Date | null;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: Object, default: {} })
  customFields!: Record<string, unknown>;

  @Prop({ trim: true })
  notes?: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
EmployeeSchema.index({ employeeCode: 1 }, { unique: true });
EmployeeSchema.index({ normalizedFullName: 1 });
