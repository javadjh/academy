import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { CHARACTER_ERROR, MAX_ERROR, STRING_ERROR } from 'src/config/Dict';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number = 400;
    try {
      statusCode = exception?.getStatus() || 500;
    } catch (error) {
      statusCode = 500;
    }

    console.log(exception);

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode,
      message: exception?.response?.message,
      timestamp: new Date().toJalali(),
      data: exception?.response,
      path: request.url,
      state: false,
    });
  }
}
