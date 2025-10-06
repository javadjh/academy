import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateClassRequestDto } from '../../dto/request/UpdateClassRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';

export class UpdateClassCommand {
  constructor(
    public readonly dto: UpdateClassRequestDto,
    public readonly classId: string,
  ) {}
}

@CommandHandler(UpdateClassCommand)
export class UpdateClassHandler implements ICommandHandler<UpdateClassCommand> {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}
  async execute(command: UpdateClassCommand): Promise<any> {
    const { dto, classId } = command;

    const updateClass: Class = await this.classModel.findByIdAndUpdate(
      classId,
      {
        $set: { ...dto },
      },
    );

    if (!updateClass?._id) throw new RecordNotFoundException();

    return Response.updated();
  }
}
