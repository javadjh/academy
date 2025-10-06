import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnsupportedMediaTypeException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import path, { extname, join } from 'path';
import { YOU_CANT_DO_IT_ERROR_MESSAGE } from './messages';

const ImageFileFilter = (req, file, callback) => {
  // if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG|pdf)$/)) {
  //   const err = new UnsupportedMediaTypeException(YOU_CANT_DO_IT_ERROR_MESSAGE);
  //   return callback(err, false);
  // }
  callback(null, true);
};

export const multerConfig: any = {
  fileFilter: (req: any, file: any, cb: any) => {
    cb(null, true);
  },
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      // Generating a 32 random chars long string
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      //Calling the callback passing the random name generated with the original extension name
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  // fileFilter: ImageFileFilter,
};

export const getDist = async () => {
  let DEST = `../../uploads`;
  const destPath = join(__dirname, DEST);
  if (!existsSync(destPath)) {
    await mkdirSync(destPath);
  }

  return destPath;
};
