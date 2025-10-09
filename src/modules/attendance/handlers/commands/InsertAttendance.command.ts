import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from 'src/schema/user.schema';
import { InsertAttendanceRequestDto } from '../../dto/request/InsertAttendanceRequest.dto';
import { Attendance, AttendanceDocument } from 'src/schema/Attendance.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Response } from 'src/config/response';

export class InsertAttendanceCommand {
  constructor(
    public readonly dto: InsertAttendanceRequestDto,
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(InsertAttendanceCommand)
export class InsertAttendanceHandler
  implements ICommandHandler<InsertAttendanceCommand>
{
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
  ) {}
  async execute(command: InsertAttendanceCommand): Promise<any> {
    const { dto, user, department, semester } = command;

    const attendance: Attendance = await new this.attendanceModel({
      class: dto.classId,
      teacher: user?._id,
      attendanceList: dto.attendanceList,
      department,
      semester,
    }).save();

    if (!attendance?._id) throw new RecordNotFoundException();

    return Response.inserted();
  }
}
