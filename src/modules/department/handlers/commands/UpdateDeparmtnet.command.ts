import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDepartmentRequestDto } from '../../dto/request/UpdateDepartmentRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Department, DepartmentDocument } from 'src/schema/department.schema';
import { Model } from 'mongoose';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Response } from 'src/config/response';

export class UpdateDeparmtnetCommand {
  constructor(
    public readonly dto: UpdateDepartmentRequestDto,
    public readonly departmentId: string,
  ) {}
}

@CommandHandler(UpdateDeparmtnetCommand)
export class UpdateDeparmtnetHandler
  implements ICommandHandler<UpdateDeparmtnetCommand>
{
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}
  async execute(command: UpdateDeparmtnetCommand): Promise<any> {
    const { departmentId, dto } = command;

    const department = await this.departmentModel.findByIdAndUpdate(
      departmentId,
      {
        $set: {
          ...dto,
        },
      },
    );

    if (!department?._id) throw new RecordNotFoundException();

    return Response.updated();
  }
}
