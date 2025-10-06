import { DeleteClassHandler } from './commands/DeleteClass.command';
import { InsertClassHandler } from './commands/InsertClass.command';
import { UpdateClassHandler } from './commands/UpdateClass.command';
import { GetClassesHandler } from './queries/GetClasses.query';
import { GetStudentClassesHandler } from './queries/GetStudentClasses.query';
import { GetTeacherClassesHandler } from './queries/GetTeacherClasses.query';

export default [
  //commands
  DeleteClassHandler,
  InsertClassHandler,
  UpdateClassHandler,

  //queries
  GetClassesHandler,
  GetStudentClassesHandler,
  GetTeacherClassesHandler,
];
