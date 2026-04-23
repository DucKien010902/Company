import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PositionDocument = HydratedDocument<Position>;

export enum PositionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true, collection: 'positions' })
export class Position {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  level?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Role', default: [] })
  defaultRoleIds!: Types.ObjectId[];

  @Prop({ enum: PositionStatus, default: PositionStatus.ACTIVE })
  status!: PositionStatus;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
