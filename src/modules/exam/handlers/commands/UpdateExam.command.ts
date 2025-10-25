import { User, UserDocument } from 'src/schema/user.schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { UpdateExamRequestDto } from '../../dto/request/UpdateExamRequest.dto';
import { Sms } from 'src/config/Sms';

export class UpdateExamCommand {
  constructor(
    public readonly dto: UpdateExamRequestDto,
    public readonly examId: string,
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(UpdateExamCommand)
export class UpdateExamHandler implements ICommandHandler<UpdateExamCommand> {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async execute(command: UpdateExamCommand): Promise<any> {
    const { dto, user, examId, department, semester } = command;

    const exam = await this.examModel.findByIdAndUpdate(examId, {
      ...dto,
      ...{
        students: dto.studentIds,
        // class: dto.classId,
        teacher: user?._id,
        classGroup: dto.classGroupId,
        department,
        semester,
      },
    });

    if (!exam?._id) throw new RecordNotFoundException();

    const sutudents: Array<any> = await this.userModel.find({
      _id: { $in: dto.studentIds },
    });

    let phoneNumbers = [];
    for (let i = 0; i < sutudents.length; i++) {
      const element = sutudents[i];
      phoneNumbers.push(element?.phoneNumber);
    }
    await Sms.sendSms(phoneNumbers, 'یک مورد آزمون ویرایش شده');

    return Response.inserted();
  }
}
