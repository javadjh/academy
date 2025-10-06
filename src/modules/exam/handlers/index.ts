import { DeleteAdminExamHandler } from './commands/DeleteAdminExam.command';
import { DeleteExamHandler } from './commands/DeleteExam.command';
import { InserAdminExamHandler } from './commands/InserAdminExam.command';
import { InsertExamHandler } from './commands/InsertExam.command';
import { SetExamResultesHandler } from './commands/SetExamResultes.command';
import { UpdateAdminExamHandler } from './commands/UpdateAdminExam.command';
import { UpdateExamHandler } from './commands/UpdateExam.command';
import { GetAdminExamsHandler } from './queries/GetAdminExams.query';
import { GetExamsHandler } from './queries/GetUserExams.query';

export default [
  DeleteExamHandler,
  DeleteAdminExamHandler,
  InserAdminExamHandler,
  InsertExamHandler,
  SetExamResultesHandler,
  UpdateExamHandler,
  UpdateAdminExamHandler,

  //queries
  GetAdminExamsHandler,
  GetExamsHandler,
];
