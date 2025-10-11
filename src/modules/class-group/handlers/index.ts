import { DeleteClassGroupHandler } from './commands/DeleteClassGroup.command';
import { InsertClassGroupHandler } from './commands/InsertClassGroup.command';
import { UpdateClassGroupHandler } from './commands/UpdateClassGroup.command';
import { GetClassGroupsHandler } from './queries/GetClassGroups.query';

export default [
  InsertClassGroupHandler,
  UpdateClassGroupHandler,
  DeleteClassGroupHandler,
  GetClassGroupsHandler,
];
