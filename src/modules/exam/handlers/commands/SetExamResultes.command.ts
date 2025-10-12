import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetExamResultesRequestDto } from '../../dto/request/SetExamResultesRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Response } from 'src/config/response';
import { Sms } from 'src/config/Sms';

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
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

    const sutudents: Array<any> = await this.userModel.find({
      _id: { $in: exam.students },
    });

    let phoneNumbers = [];
    for (let i = 0; i < sutudents.length; i++) {
      const element = sutudents[i];
      phoneNumbers.push(element?.phoneNumber);
    }
    await Sms.sendSms(phoneNumbers, 'نتایج یک آزمون جدید منتشر شد');

    return Response.updated();
  }
}
