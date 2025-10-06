import { BadRequestException } from '@nestjs/common';
import { OBJECT_ID_ERROR_MESSAGE } from 'src/config/messages';
import mongoose, { isValidObjectId } from 'mongoose';

export {};

declare global {
  interface String {
    isObjectId(): void;
    toObjectId(): mongoose.Types.ObjectId;
  }
}

String.prototype.isObjectId = function (): void {
  // if (typeof this != 'string') return;
  // if (this?.length < 9 || !isValidObjectId(this)) {
  //   throw new BadRequestException(OBJECT_ID_ERROR_MESSAGE);
  // }
  return this;
};
String.prototype.toObjectId = function (): mongoose.Types.ObjectId {
  // return new mongoose.Types.ObjectId(this);
  return this;
};
