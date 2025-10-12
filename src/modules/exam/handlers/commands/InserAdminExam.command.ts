import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InserAdminExamRequestDto } from '../../dto/request/InserAdminExamRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { InsertException } from 'src/filters/insertException.filter';
import { Response } from 'src/config/response';
import { User, UserDocument } from 'src/schema/user.schema';
import { Sms } from 'src/config/Sms';
import { ClassGroup, ClassGroupDocument } from 'src/schema/class-group.schema';

export class InserAdminExamCommand {
  constructor(
    public readonly dto: InserAdminExamRequestDto,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(InserAdminExamCommand)
export class InserAdminExamHandler
  implements ICommandHandler<InserAdminExamCommand>
{
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ClassGroup.name)
    private readonly classGroupModel: Model<ClassGroupDocument>,
  ) {}
  async execute(command: InserAdminExamCommand): Promise<any> {
    const { dto, department, semester } = command;

    dto.studentIds =
      (await this.classGroupModel.findById(dto.classGroupId))?.students || [];

    const exam = await new this.examModel({
      ...dto,
      ...{
        students: dto.studentIds,
        class: dto.classId,
        teacher: dto.teacherId,
        department,
        classGroup: dto.classGroupId,
        semester,
      },
    }).save();

    if (!exam?._id) throw new InsertException();

    const sutudents: Array<any> = await this.userModel.find({
      _id: { $in: dto.studentIds },
    });

    let phoneNumbers = [];
    for (let i = 0; i < sutudents.length; i++) {
      const element = sutudents[i];
      phoneNumbers.push(element?.phoneNumber);
    }
    await Sms.sendSms(phoneNumbers, 'آزمون جدیدی برای شما ایجاد شده');

    return Response.inserted();
  }
}
