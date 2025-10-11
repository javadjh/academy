import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateClassGroupRequestDto } from '../../dto/request/UpdateClassGroupRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassGroup, ClassGroupDocument } from 'src/schema/class-group.schema';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Response } from 'src/config/response';

export class UpdateClassGroupCommand {
  constructor(
    public readonly dto: UpdateClassGroupRequestDto,
    public readonly classGroupId: string,
  ) {}
}

@CommandHandler(UpdateClassGroupCommand)
export class UpdateClassGroupHandler
  implements ICommandHandler<UpdateClassGroupCommand>
{
  constructor(
    @InjectModel(ClassGroup.name)
    private readonly classGroupModel: Model<ClassGroupDocument>,
  ) {}
  async execute(command: UpdateClassGroupCommand): Promise<any> {
    const { dto, classGroupId } = command;

    const classGroup = await this.classGroupModel.findByIdAndUpdate(
      classGroupId,
      { ...dto, ...{ students: dto.studentIds } },
    );

    if (!classGroup?._id) throw new RecordNotFoundException();

    return Response.inserted();
  }
}
