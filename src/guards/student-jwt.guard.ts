import { AuthGuard } from '@nestjs/passport';
export class StudentJwtGuard extends AuthGuard('student-jwt') {
  constructor() {
    super();
  }
}
