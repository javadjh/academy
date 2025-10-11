import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InsertClassRequestDto } from '../../dto/request/InsertClassRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { Model } from 'mongoose';
import { InsertException } from 'src/filters/insertException.filter';
import { Response } from 'src/config/response';
import { ClassGroup, ClassGroupDocument } from 'src/schema/class-group.schema';

export class InsertClassCommand {
  constructor(
    public readonly dto: InsertClassRequestDto,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(InsertClassCommand)
export class InsertClassHandler implements ICommandHandler<InsertClassCommand> {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    @InjectModel(ClassGroup.name)
    private readonly classGroupModel: Model<ClassGroupDocument>,
  ) {}
  async execute(command: InsertClassCommand): Promise<any> {
    const { dto, department, semester } = command;

    dto.studentIds = (
      await this.classGroupModel.findById(dto.classGroupId)
    ).students;

    const newClass: Class = await new this.classModel({
      ...dto,
      ...{
        students: dto.studentIds,
        teacher: dto.teacherId,
        classGroup: dto.classGroupId,
        department,
        semester,
      },
    }).save();

    if (!newClass?._id) throw new InsertException();

    return Response.inserted();
  }
}
