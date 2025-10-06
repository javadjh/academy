import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from './share/BaseModel';
import { nanoid } from 'nanoid';
import { userTypeEnum } from 'src/shareDTO/enums';
import { genderEnumSchema, userTypeEnumSchema } from './share/enums';

export type UserDocument = User & Document;
class BaseUserModel extends BaseModel {}

@Schema({ timestamps: true })
export class User extends BaseUserModel {
  @Prop({ type: String, default: () => nanoid(10) })
  _id: string;

  @Prop({ enum: userTypeEnumSchema, default: userTypeEnum.student })
  userType?: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  fullName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  password: string;

  @Prop({ type: String, enum: genderEnumSchema })
  gender?: string;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
