import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserAttendanceDocument = HydratedDocument<UserAttendance>;

@Schema({
  collection: 'user-attendance',
  strict: false,
  versionKey: false,
})
export class UserAttendance {
  @Prop({ required: true, index: true })
  USERID!: number;

  @Prop({ trim: true, index: true })
  Badgenumber?: string;

  @Prop({ trim: true, index: true })
  Name?: string;

  @Prop()
  DEFAULTDEPTID?: number;
}

export const UserAttendanceSchema = SchemaFactory.createForClass(UserAttendance);
UserAttendanceSchema.index({ USERID: 1 }, { unique: false });
UserAttendanceSchema.index({ Badgenumber: 1 });
UserAttendanceSchema.index({ Name: 1 });
