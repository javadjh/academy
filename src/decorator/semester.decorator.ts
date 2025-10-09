import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Semester = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['semester'] || null;
  },
);
