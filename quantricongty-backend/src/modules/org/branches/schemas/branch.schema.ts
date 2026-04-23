import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

export enum BranchStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true, collection: 'branches' })
export class Branch {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  type?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ enum: BranchStatus, default: BranchStatus.ACTIVE })
  status!: BranchStatus;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
