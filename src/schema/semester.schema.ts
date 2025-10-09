import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from './share/BaseModel';
import { nanoid } from 'nanoid';
import { ApiProperty } from '@nestjs/swagger';

export type SemesterDocument = Semester & Document;

@Schema({ timestamps: true })
export class Semester extends BaseModel {
  @Prop({ type: String, default: () => nanoid(10) })
  _id: string;

  @ApiProperty()
  @Prop()
  title: string;

  @ApiProperty()
  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const SemesterSchema = SchemaFactory.createForClass(Semester);
