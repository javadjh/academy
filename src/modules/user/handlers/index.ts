import { DeleteUserHandler } from './commands/DeleteUser.command';
import { InsertAdminUserHandler } from './commands/InsertAdminUser.command';
import { UpdateAdminUserHandler } from './commands/UpdateAdminUser.command';
import { UserSeedingHandler } from './commands/UserSeeding.command';
import { GetAdminUsersHandler } from './queries/GetAdminUsers.query';
import { GetStudentsHandler } from './queries/GetStudents.query';
import { GetTeachersHandler } from './queries/GetTeachers.query';
import { LoginHandler } from './queries/Login.query';

export default [
  //commands
  InsertAdminUserHandler,
  UpdateAdminUserHandler,
  DeleteUserHandler,
  UserSeedingHandler,

  //queries
  GetAdminUsersHandler,
  LoginHandler,
  GetTeachersHandler,
  GetStudentsHandler,
];
