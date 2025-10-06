import { User } from 'src/schema/user.schema';
import { InsertExamRequestDto } from '../../dto/request/InsertExamRequest.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { InsertException } from 'src/filters/insertException.filter';
import { Response } from 'src/config/response';

export class InsertExamCommand {
  constructor(
    public readonly dto: InsertExamRequestDto,
    public readonly user: User,
  ) {}
}

@CommandHandler(InsertExamCommand)
export class InsertExamHandler implements ICommandHandler<InsertExamCommand> {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
  ) {}
  async execute(command: InsertExamCommand): Promise<any> {
    const { dto, user } = command;

    const exam = await new this.examModel({
      ...dto,
      ...{ students: dto.studentIds, class: dto.classId, teacher: user?._id },
    }).save();

    if (!exam?._id) throw new InsertException();

    return Response.inserted();
  }
}
