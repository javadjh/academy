import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InsertClassGroupRequestDto } from '../../dto/request/InsertClassGroupRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassGroup, ClassGroupDocument } from 'src/schema/class-group.schema';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Response } from 'src/config/response';
import { InsertException } from 'src/filters/insertException.filter';

export class InsertClassGroupCommand {
  constructor(public readonly dto: InsertClassGroupRequestDto) {}
}

@CommandHandler(InsertClassGroupCommand)
export class InsertClassGroupHandler
  implements ICommandHandler<InsertClassGroupCommand>
{
  constructor(
    @InjectModel(ClassGroup.name)
    private readonly classGroupModel: Model<ClassGroupDocument>,
  ) {}
  async execute(command: InsertClassGroupCommand): Promise<any> {
    const { dto } = command;

    const classGroup = await new this.classGroupModel({
      ...dto,
      ...{ students: dto.studentIds },
    }).save();

    if (!classGroup?._id) throw new InsertException();

    return Response.inserted();
  }
}
