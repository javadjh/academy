import { User } from 'src/schema/user.schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';

export class DeleteExamCommand {
  constructor(
    public readonly examId: string,
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(DeleteExamCommand)
export class DeleteExamHandler implements ICommandHandler<DeleteExamCommand> {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
  ) {}
  async execute(command: DeleteExamCommand): Promise<any> {
    const { user, examId, department, semester } = command;

    let exam = await this.examModel.findOneAndUpdate(
      {
        _id: examId,
        teacher: user?._id,
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
