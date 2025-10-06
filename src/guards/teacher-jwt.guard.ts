import { AuthGuard } from '@nestjs/passport';
export class TeacherJwtGuard extends AuthGuard('teacher-jwt') {
  constructor() {
    super();
  }
}
