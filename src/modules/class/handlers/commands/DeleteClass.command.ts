import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';

export class DeleteClassCommand {
  constructor(
    public readonly classId: string,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(DeleteClassCommand)
export class DeleteClassHandler implements ICommandHandler<DeleteClassCommand> {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}
  async execute(command: DeleteClassCommand): Promise<any> {
    const { classId, department, semester } = command;

    const deleteClass: Class = await this.classModel.findOneAndUpdate(
      { _id: classId, department, semester },
      {
        $set: { isActive: false },
      },
    );

    if (!deleteClass?._id) throw new RecordNotFoundException();

    return Response.deleted();
  }
}
