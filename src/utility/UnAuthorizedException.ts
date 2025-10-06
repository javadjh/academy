import { HttpException } from '@nestjs/common';

export class UnAuthorizedException extends HttpException {
  constructor() {
    super('your are un authorized', 403);
  }
}

export class UnAthenticatedException extends HttpException {
  constructor() {
    super('your are not athenticated', 401);
  }
}
