import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from './share/BaseModel';
import { nanoid } from 'nanoid';
import { ApiProperty } from '@nestjs/swagger';

export type AppSettingDocument = AppSetting & Document;

@Schema({ timestamps: true })
export class AppSetting extends BaseModel {
  @Prop({ type: String, default: () => nanoid(10) })
  _id: string;

  @ApiProperty()
  @Prop()
  servicePrice: number;
}

export const AppSettingSchema = SchemaFactory.createForClass(AppSetting);
