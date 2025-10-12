import { User } from 'src/schema/user.schema';
import { UpdateAttendanceRequestDto } from '../../dto/request/UpdateAttendanceRequest.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Attendance, AttendanceDocument } from 'src/schema/attendance.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Response } from 'src/config/response';
import { Sms } from 'src/config/Sms';

export class UpdateAttendanceCommand {
  constructor(
    public readonly dto: UpdateAttendanceRequestDto,
    public readonly user: User,
    public readonly attendateId: string,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(UpdateAttendanceCommand)
export class UpdateAttendanceHandler
  implements ICommandHandler<UpdateAttendanceCommand>
{
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
  ) {}
  async execute(command: UpdateAttendanceCommand): Promise<any> {
    const { department, dto, semester, user, attendateId } = command;

    const attendance: Attendance = await this.attendanceModel.findByIdAndUpdate(
      attendateId,
      {
        class: dto.classId,
        teacher: user?._id,
        attendanceList: dto.attendanceList,
        department,
        semester,
      },
    );

    if (!attendance?._id) throw new RecordNotFoundException();

    let attendanceItem = await this.attendanceModel
      .findById(attendance?._id)
      .populate('attendanceList.user')
      .lean();

    let listPhoneNumber = attendanceItem.attendanceList.filter(
      (ele) => ele.isPresent == false,
    );

    listPhoneNumber = listPhoneNumber?.map((item) => {
      return item.user?.phoneNumber;
    });
    console.log(listPhoneNumber);

    if (listPhoneNumber?.length > 0)
      Sms.sendSms(listPhoneNumber, 'شما امروز غایب بودید');

    return Response.inserted();
  }
}
