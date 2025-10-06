import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from './share/BaseModel';
import { nanoid } from 'nanoid';
import { ApiProperty } from '@nestjs/swagger';

export type CityDocument = City & Document;

export class Province {
  @ApiProperty()
  @Prop()
  id?: number;

  @ApiProperty()
  @Prop()
  name?: string;

  @ApiProperty()
  @Prop()
  slug?: string;

  @ApiProperty()
  @Prop()
  latitude?: string;

  @ApiProperty()
  @Prop()
  longitude?: string;
}

@Schema({ timestamps: true })
export class City extends BaseModel {
  @Prop({ type: String, default: () => nanoid(10) })
  _id?: string | number | undefined;

  @ApiProperty()
  @Prop()
  id?: number;

  @ApiProperty()
  @Prop()
  province_id?: number;

  @ApiProperty()
  @Prop()
  name?: string;

  @Prop()
  expertiseCount?: number;

  @ApiProperty()
  @Prop()
  slug?: string;

  @ApiProperty()
  @Prop()
  latitude?: string;

  @ApiProperty()
  @Prop()
  longitude?: string;

  @ApiProperty()
  @Prop()
  is_center?: number;

  @ApiProperty()
  @Prop()
  priority?: number;

  @ApiProperty({ type: Province })
  @Prop({ type: Province })
  province?: Province;
}

export const CitySchema = SchemaFactory.createForClass(City);
