import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ContactPersonDocument = HydratedDocument<ContactPerson>;

@Schema({ timestamps: true, collection: 'contact_people' })
export class ContactPerson {
  @Prop({ type: Types.ObjectId, ref: 'ExternalParty', required: true, index: true })
  partyId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ trim: true })
  title?: string;

  @Prop({ trim: true })
  department?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ default: false })
  isPrimary!: boolean;

  @Prop({ trim: true })
  notes?: string;
}

export const ContactPersonSchema = SchemaFactory.createForClass(ContactPerson);
