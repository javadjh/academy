import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetExamResultesRequestDto } from '../../dto/request/SetExamResultesRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Response } from 'src/config/response';

export class SetExamResultesCommand {
  constructor(
    public readonly dto: SetExamResultesRequestDto,
    public readonly examId: string,
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(SetExamResultesCommand)
export class SetExamResultesHandler
  implements ICommandHandler<SetExamResultesCommand>
{
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
  ) {}
  async execute(command: SetExamResultesCommand): Promise<any> {
    const { dto, examId, user, department, semester } = command;

    const exam = await this.examModel.findOne({
      _id: examId,
      teacher: user?._id,
      department,
      semester,
    });

    if (!exam?._id) throw new RecordNotFoundException();

    exam.resultes = dto.resultes;

    await exam.save();

    return Response.updated();
  }
}
