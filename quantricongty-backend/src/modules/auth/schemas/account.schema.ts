import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOCKED = 'locked',
}

@Schema({ timestamps: true, collection: 'accounts' })
export class Account {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Role', default: [] })
  roleIds!: Types.ObjectId[];

  @Prop({ enum: AccountStatus, default: AccountStatus.ACTIVE })
  status!: AccountStatus;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date | null;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
