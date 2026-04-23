import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true, collection: 'company_profiles' })
export class Company {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  legalName?: string;

  @Prop({ trim: true, lowercase: true })
  code?: string;

  @Prop({ trim: true })
  taxCode?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ trim: true })
  website?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true, default: 'Asia/Bangkok' })
  timezone!: string;

  @Prop({ trim: true, default: 'VND' })
  currency!: string;

  @Prop({ type: Object, default: {} })
  settings!: Record<string, unknown>;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
