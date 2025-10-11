import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from './share/BaseModel';
import { nanoid } from 'nanoid';
import { weekDayEnumSchema } from './share/enums';
import { ApiProperty } from '@nestjs/swagger';

export type ClassDocument = Class & Document;
class BaseClassModel extends BaseModel {}

export class ScheduleTimes {
  @ApiProperty()
  dayWeek: string;

  @ApiProperty()
  time: string;
}

@Schema({ timestamps: true })
export class Class extends BaseClassModel {
  scheduleTimesFormated: any;

  @Prop({ type: String, default: () => nanoid(10) })
  @ApiProperty()
  _id: string;

  @Prop({ type: String })
  @ApiProperty()
  title: string;

  @Prop({ type: Boolean, default: true })
  @ApiProperty()
  isActive?: boolean;

  @Prop({ ref: 'User', type: [String] })
  @ApiProperty()
  students: Array<string | any>;

  @Prop({ ref: 'User', type: String })
  @ApiProperty()
  teacher: string | any;

  @Prop({ ref: 'Department', type: String })
  department: string | any;

  @Prop({ ref: 'Semester', type: String })
  semester: string | any;

  @Prop({ ref: 'ClassGroup', type: String })
  classGroup: string | any;

  @Prop({
    type: [
      {
        dayWeek: String,
        time: String,
      },
    ],
  })
  @ApiProperty()
  scheduleTimes: Array<ScheduleTimes>;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
