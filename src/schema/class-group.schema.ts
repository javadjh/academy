import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from './share/BaseModel';
import { nanoid } from 'nanoid';
import { ApiProperty } from '@nestjs/swagger';

export type ClassGroupDocument = ClassGroup & Document;
class BaseClassGroupModel extends BaseModel {}

@Schema({ timestamps: true })
export class ClassGroup extends BaseClassGroupModel {
  @Prop({ type: String, default: () => nanoid(10) })
  @ApiProperty()
  _id: string;

  @Prop({ type: String })
  @ApiProperty()
  title: string;

  @Prop({ ref: 'User', type: [String] })
  @ApiProperty()
  students: Array<string | any>;
}

export const ClassGroupSchema = SchemaFactory.createForClass(ClassGroup);
