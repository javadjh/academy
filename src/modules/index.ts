import { AttendanceModule } from './attendance/attendance.module';
import { ClassGroupModule } from './class-group/class-group.module';
import { ClassModule } from './class/class.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DepartmentModule } from './department/department.module';
import { ExamModule } from './exam/exam.module';
import { SemesterModule } from './semester/semester.module';
import { UserModule } from './user/user.module';

export default [
  UserModule,
  ClassModule,
  ClassGroupModule,
  AttendanceModule,
  ExamModule,
  DashboardModule,
  DepartmentModule,
  SemesterModule,
];
