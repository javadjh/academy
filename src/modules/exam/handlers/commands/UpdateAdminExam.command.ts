import { User } from 'src/schema/user.schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { UpdateAdminExamRequestDto } from '../../dto/request/UpdateAdminExamRequest.dto';

export class UpdateAdminExamCommand {
  constructor(
    public readonly dto: UpdateAdminExamRequestDto,
    public readonly examId: string,
    public readonly user: User,
  ) {}
}

@CommandHandler(UpdateAdminExamCommand)
export class UpdateAdminExamHandler
  implements ICommandHandler<UpdateAdminExamCommand>
{
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
  ) {}
  async execute(command: UpdateAdminExamCommand): Promise<any> {
    const { dto, user, examId } = command;

    const exam = await this.examModel.findByIdAndUpdate(examId, {
      ...dto,
      ...{ students: dto.studentIds, class: dto.classId, teacher: user?._id },
    });

    if (!exam?._id) throw new RecordNotFoundException();

    return Response.inserted();
  }
}
