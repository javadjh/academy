import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { ClassGroup, ClassGroupDocument } from 'src/schema/class-group.schema';

export class DeleteClassGroupCommand {
  constructor(public readonly classGroupId: string) {}
}

@CommandHandler(DeleteClassGroupCommand)
export class DeleteClassGroupHandler
  implements ICommandHandler<DeleteClassGroupCommand>
{
  constructor(
    @InjectModel(ClassGroup.name)
    private readonly classGroupModel: Model<ClassGroupDocument>,
  ) {}
  async execute(command: DeleteClassGroupCommand): Promise<any> {
    const { classGroupId } = command;

    await this.classGroupModel.findByIdAndRemove(classGroupId);

    return Response.deleted();
  }
}
