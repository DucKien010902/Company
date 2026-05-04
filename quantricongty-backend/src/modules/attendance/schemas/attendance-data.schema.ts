import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttendanceDataDocument = HydratedDocument<AttendanceData>;

@Schema({
  collection: 'attendance-data',
  strict: false,
  versionKey: false,
})
export class AttendanceData {
  @Prop({ required: true, index: true })
  USERID!: number;

  @Prop({ required: true, index: true })
  CHECKTIME!: string;

  @Prop({ index: true })
  CHECK_DATE?: string;

  @Prop()
  CHECK_TIME?: string;

  @Prop()
  YEAR?: number;

  @Prop()
  MONTH?: number;

  @Prop()
  DAY?: number;

  @Prop()
  HOUR?: number;

  @Prop()
  MINUTE?: number;

  @Prop()
  SECOND?: number;

  @Prop()
  CHECKTYPE?: string;

  @Prop()
  VERIFYCODE?: number;

  @Prop()
  SENSORID?: string;

  @Prop()
  WorkCode?: string;

  @Prop()
  sn?: string;

  @Prop()
  UserExtFmt?: number;
}

export const AttendanceDataSchema = SchemaFactory.createForClass(AttendanceData);
AttendanceDataSchema.index({ USERID: 1, CHECKTIME: 1 });
AttendanceDataSchema.index({ USERID: 1, CHECK_DATE: 1 });
AttendanceDataSchema.index({ CHECK_DATE: 1 });
