import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from './share/BaseModel';
import { nanoid } from 'nanoid';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Resultes {
  @ApiProperty()
  @IsString()
  student: string | any;

  @ApiProperty()
  @IsNumber()
  score: number;
}

export type ExamDocument = Exam & Document;
class BaseExamModel extends BaseModel {}

@Schema({ timestamps: true })
export class Exam extends BaseExamModel {
  resultesScore?: number;

  @Prop({ type: String, default: () => nanoid(10) })
  @ApiProperty()
  _id: string;

  @Prop({ type: String })
  @ApiProperty()
  title: string;

  @Prop({ type: Date })
  @ApiProperty()
  date: string | any;

  @Prop({ type: String })
  @ApiProperty()
  time: string;

  @Prop({ ref: 'Department', type: String })
  department: string | any;

  @Prop({ ref: 'Semester', type: String })
  semester: string | any;

  @Prop({ ref: 'ClassGroup', type: String })
  classGroup: string | any;

  @Prop({
    type: [
      {
        student: { ref: 'User', type: String },
        score: Number,
      },
    ],
  })
  @ApiProperty()
  resultes: Array<Resultes>;

  @Prop({ type: Boolean, default: true })
  @ApiProperty()
  isActive?: boolean;

  @Prop({ ref: 'User', type: [String] })
  @ApiProperty()
  students: Array<string | any>;

  @Prop({ ref: 'Class', type: String })
  @ApiProperty()
  class: string | any;

  @Prop({ ref: 'User', type: String })
  @ApiProperty()
  teacher: string | any;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
