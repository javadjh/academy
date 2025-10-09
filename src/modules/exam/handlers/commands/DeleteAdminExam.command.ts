import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';

export class DeleteAdminExamCommand {
  constructor(
    public readonly examId: string,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(DeleteAdminExamCommand)
export class DeleteAdminExamHandler
  implements ICommandHandler<DeleteAdminExamCommand>
{
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
  ) {}
  async execute(command: DeleteAdminExamCommand): Promise<any> {
    const { examId, department, semester } = command;

    let exam = await this.examModel.findOneAndUpdate(
      {
        _id: examId,
        department,
        semester,
      },
      {
        $set: { isActive: false },
      },
    );

    if (!exam?._id) throw new RecordNotFoundException();

    return Response.deleted();
  }
}
