import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ExternalPartyDocument = HydratedDocument<ExternalParty>;

@Schema({ timestamps: true, collection: 'external_parties' })
export class ExternalParty {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code!: string;

  @Prop({ required: true, enum: ['person', 'company'] })
  partyType!: 'person' | 'company';

  @Prop({ type: [String], default: [] })
  relationshipTypes!: string[];

  @Prop({ required: true, trim: true })
  displayName!: string;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  normalizedDisplayName!: string;

  @Prop({ trim: true })
  legalName?: string;

  @Prop({ trim: true })
  taxCode?: string;

  @Prop({ trim: true })
  website?: string;

  @Prop({ type: [String], default: [] })
  phones!: string[];

  @Prop({ type: [String], default: [] })
  emails!: string[];

  @Prop({ type: [String], default: [] })
  addresses!: string[];

  @Prop({ type: Types.ObjectId, ref: 'Employee', default: null })
  ownerEmployeeId?: Types.ObjectId | null;

  @Prop({ type: [Types.ObjectId], ref: 'Employee', default: [] })
  assignedEmployeeIds!: Types.ObjectId[];

  @Prop({ trim: true })
  source?: string;

  @Prop({ trim: true, default: 'active' })
  lifecycleStatus!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: Object, default: {} })
  customFields!: Record<string, unknown>;

  @Prop({ trim: true })
  notes?: string;
}

export const ExternalPartySchema = SchemaFactory.createForClass(ExternalParty);
ExternalPartySchema.index({ code: 1 }, { unique: true });
ExternalPartySchema.index({ normalizedDisplayName: 1 });
