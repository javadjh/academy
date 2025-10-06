import { ApiProperty } from '@nestjs/swagger';

export class Response {
  static success(data: any) {
    return {
      state: true,
      data,
    };
  }
  static inserted(): ResponseDto {
    let res: ResponseDto = {
      state: true,
      message: 'ثبت شد',
      data: {},
    };

    return res;
  }
  static deleted(): ResponseDto {
    let res: ResponseDto = {
      state: true,
      message: 'حذف شد',
      data: {},
    };

    return res;
  }
  static active(): ResponseDto {
    let res: ResponseDto = {
      state: true,
      message: 'فعال شد',
      data: {},
    };

    return res;
  }
  static updated() {
    return {
      state: true,
      message: 'بروز شد',
      data: {},
    };
  }
  static confirmed() {
    return {
      state: true,
      message: 'تایید شد',
      data: {},
    };
  }
  static sent() {
    return {
      state: true,
      message: 'ارسال شد',
      data: {},
    };
  }
  static rejected() {
    return {
      state: true,
      message: 'رد شد',
      data: {},
    };
  }

  static send(data: any): ResponseDto {
    let res: ResponseDto = {
      state: true,
      data,
    };

    return res;
  }
}
export class ResponseDto {
  @ApiProperty()
  state?: boolean = true;
  @ApiProperty()
  message?: string;
  // @ApiProperty()
  data?: any;
}
