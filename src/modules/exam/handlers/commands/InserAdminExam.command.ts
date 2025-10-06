import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InserAdminExamRequestDto } from '../../dto/request/InserAdminExamRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { InsertException } from 'src/filters/insertException.filter';
import { Response } from 'src/config/response';

export class InserAdminExamCommand {
  constructor(public readonly dto: InserAdminExamRequestDto) {}
}

@CommandHandler(InserAdminExamCommand)
export class InserAdminExamHandler
  implements ICommandHandler<InserAdminExamCommand>
{
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
  ) {}
  async execute(command: InserAdminExamCommand): Promise<any> {
    const { dto } = command;

    const exam = await new this.examModel({
      ...dto,
      ...{
        students: dto.studentIds,
        class: dto.classId,
        teacher: dto.teacherId,
      },
    }).save();

    if (!exam?._id) throw new InsertException();

    return Response.inserted();
  }
}
