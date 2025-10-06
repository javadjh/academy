import { InsertAttendanceHandler } from './commands/InsertAttendance.command';
import { GetAdminAttendanceHandler } from './queries/GetAdminAttendance.query';
import { GetAttendanceHandler } from './queries/GetAttendance.query';

export default [
  //commands
  InsertAttendanceHandler,

  //queries
  GetAdminAttendanceHandler,
  GetAttendanceHandler,
];
