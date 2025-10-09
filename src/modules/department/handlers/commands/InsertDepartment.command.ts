import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InsertDepartmentRequestDto } from '../../dto/request/InsertDepartmentRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Department, DepartmentDocument } from 'src/schema/department.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';

export class InsertDepartmentCommand {
  constructor(public readonly dto: InsertDepartmentRequestDto) {}
}

@CommandHandler(InsertDepartmentCommand)
export class InsertDepartmentHandler
  implements ICommandHandler<InsertDepartmentCommand>
{
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}
  async execute(command: InsertDepartmentCommand): Promise<any> {
    const { dto } = command;

    const department: Department = await new this.departmentModel({
      ...dto,
    }).save();

    if (!department?._id) throw new RecordNotFoundException();

    return Response.inserted();
  }
}
