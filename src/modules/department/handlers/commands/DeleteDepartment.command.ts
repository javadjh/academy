import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Department, DepartmentDocument } from 'src/schema/department.schema';

export class DeleteDepartmentCommand {
  constructor(public readonly departmentId: string) {}
}

@CommandHandler(DeleteDepartmentCommand)
export class DeleteDepartmentHandler
  implements ICommandHandler<DeleteDepartmentCommand>
{
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}
  async execute(command: DeleteDepartmentCommand): Promise<any> {
    const department = await this.departmentModel.findByIdAndUpdate(
      command.departmentId,
      {
        $set: {
          isActive: false,
        },
      },
    );

    if (!department?._id) throw new RecordNotFoundException();

    return Response.deleted();
  }
}
