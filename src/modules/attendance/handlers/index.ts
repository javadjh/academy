import { InsertAttendanceHandler } from './commands/InsertAttendance.command';
import { UpdateAttendanceHandler } from './commands/UpdateAttendance.command';
import { GetAdminAttendanceHandler } from './queries/GetAdminAttendance.query';
import { GetAttendanceHandler } from './queries/GetAttendance.query';

export default [
  //commands
  InsertAttendanceHandler,

  //queries
  GetAdminAttendanceHandler,
  GetAttendanceHandler,
  UpdateAttendanceHandler,
];
