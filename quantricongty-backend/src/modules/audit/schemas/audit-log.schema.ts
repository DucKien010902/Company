import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: true, collection: 'audit_logs' })
export class AuditLog {
  @Prop({ required: true })
  action!: string;

  @Prop({ required: true })
  module!: string;

  @Prop()
  entityName?: string;

  @Prop()
  entityId?: string;

  @Prop()
  performedByAccountId?: string;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, unknown>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
