import { User, UserDocument } from 'src/schema/user.schema';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { UpdateAdminExamRequestDto } from '../../dto/request/UpdateAdminExamRequest.dto';
import { ClassGroup, ClassGroupDocument } from 'src/schema/class-group.schema';
import { Sms } from 'src/config/Sms';

export class UpdateAdminExamCommand {
  constructor(
    public readonly dto: UpdateAdminExamRequestDto,
    public readonly examId: string,
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(UpdateAdminExamCommand)
export class UpdateAdminExamHandler
  implements ICommandHandler<UpdateAdminExamCommand>
{
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
    @InjectModel(ClassGroup.name)
    private readonly classGroupModel: Model<ClassGroupDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async execute(command: UpdateAdminExamCommand): Promise<any> {
    const { dto, user, examId, department, semester } = command;

    dto.studentIds =
      (await this.classGroupModel.findById(dto.classGroupId))?.students || [];

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
