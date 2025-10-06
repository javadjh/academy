import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from './share/BaseModel';
import { nanoid } from 'nanoid';
import { ApiProperty } from '@nestjs/swagger';

export type AttendanceDocument = Attendance & Document;
class BaseAttendanceModel extends BaseModel {}

export class AttendanceList {
  @ApiProperty()
  user: string | any;

  @ApiProperty()
  isPresent: boolean;
}

@Schema({ timestamps: true })
export class Attendance extends BaseAttendanceModel {
  @Prop({ type: String, default: () => nanoid(10) })
  @ApiProperty()
  _id: string;

  @Prop({ ref: 'Class', type: String })
  @ApiProperty()
  class: string | any;

  @Prop({ ref: 'User', type: String })
  @ApiProperty()
  teacher: string | any;

  @Prop({
    type: [
      {
        user: { ref: 'User', type: String },
        isPresent: Boolean,
      },
    ],
  })
  @ApiProperty()
  attendanceList: Array<AttendanceList>;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
