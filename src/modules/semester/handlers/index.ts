import { DeleteSemesterHandler } from './commands/DeleteSemester.command';
import { InsertSemesterHandler } from './commands/InsertSemester.command';
import { UpdateSemesterHandler } from './commands/UpdateSemester.command';
import { GetSemestersHandler } from './queries/GetSemesters.query';

export default [
  InsertSemesterHandler,
  UpdateSemesterHandler,
  DeleteSemesterHandler,

  //queries
  GetSemestersHandler,
];
