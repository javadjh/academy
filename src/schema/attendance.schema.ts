import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from './share/BaseModel';
import { nanoid } from 'nanoid';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export type AttendanceDocument = Attendance & Document;
class BaseAttendanceModel extends BaseModel {}

export class AttendanceList {
  @ApiProperty()
  @IsString()
  user: string | any;

  @ApiProperty()
  @IsBoolean()
  isPresent: boolean;

  @ApiProperty({
    description:
      'Positive or negative score given to the student for this session.',
    required: false,
    default: 0,
  })
  @IsOptional()
  @Prop({ type: Number, default: 0 }) // ⬅️ فیلد جدید برای نمره
  score: number;
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

  @Prop({ ref: 'Department', type: String })
  department: string | any;

  @Prop({ ref: 'Semester', type: String })
  semester: string | any;

  @Prop({
    type: [
      {
        user: { ref: 'User', type: String },
        isPresent: Boolean,
        score: { default: 0, type: Number },
      },
    ],
  })
  @ApiProperty()
  attendanceList: Array<AttendanceList>;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
