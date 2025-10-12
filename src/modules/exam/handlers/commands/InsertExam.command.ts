import { User, UserDocument } from 'src/schema/user.schema';
import { InsertExamRequestDto } from '../../dto/request/InsertExamRequest.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { Model } from 'mongoose';
import { InsertException } from 'src/filters/insertException.filter';
import { Response } from 'src/config/response';
import { Sms } from 'src/config/Sms';
import { ClassGroup, ClassGroupDocument } from 'src/schema/class-group.schema';

export class InsertExamCommand {
  constructor(
    public readonly dto: InsertExamRequestDto,
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(InsertExamCommand)
export class InsertExamHandler implements ICommandHandler<InsertExamCommand> {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
    @InjectModel(ClassGroup.name)
    private readonly classGroupModel: Model<ClassGroupDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async execute(command: InsertExamCommand): Promise<any> {
    const { dto, user, department, semester } = command;

    dto.studentIds =
      (await this.classGroupModel.findById(dto.classGroupId))?.students || [];

    const exam = await new this.examModel({
      ...dto,
      ...{
        students: dto.studentIds,
        class: dto.classId,
        teacher: user?._id,
        classGroup: dto.classGroupId,
        department,
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
