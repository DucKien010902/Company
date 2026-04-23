import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true, collection: 'roles' })
export class Role {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  key!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [String], default: [] })
  permissions!: string[];

  @Prop({ default: false })
  isSystem!: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
