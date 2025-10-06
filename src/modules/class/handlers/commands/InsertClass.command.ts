import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InsertClassRequestDto } from '../../dto/request/InsertClassRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { Model } from 'mongoose';
import { InsertException } from 'src/filters/insertException.filter';
import { Response } from 'src/config/response';

export class InsertClassCommand {
  constructor(public readonly dto: InsertClassRequestDto) {}
}

@CommandHandler(InsertClassCommand)
export class InsertClassHandler implements ICommandHandler<InsertClassCommand> {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}
  async execute(command: InsertClassCommand): Promise<any> {
    const { dto } = command;

    const newClass: Class = await new this.classModel({
      ...dto,
      ...{ students: dto.studentIds, teacher: dto.teacherId },
    }).save();

    if (!newClass?._id) throw new InsertException();

    return Response.inserted();
  }
}
