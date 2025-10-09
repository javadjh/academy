import { DeleteDepartmentHandler } from './commands/DeleteDepartment.command';
import { InsertDepartmentHandler } from './commands/InsertDepartment.command';
import { UpdateDeparmtnetHandler } from './commands/UpdateDeparmtnet.command';
import { GetDepartmentsHandler } from './queries/GetDepartments.query';

export default [
  InsertDepartmentHandler,
  UpdateDeparmtnetHandler,
  DeleteDepartmentHandler,

  //queries
  GetDepartmentsHandler,
];
