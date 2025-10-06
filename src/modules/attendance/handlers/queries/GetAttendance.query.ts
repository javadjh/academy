import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Attendance, AttendanceDocument } from 'src/schema/Attendance.schema';
import { User } from 'src/schema/user.schema';
import { userTypeEnum } from 'src/shareDTO/enums';

export class GetAttendanceQuery {
  constructor(public readonly user: User) {}
}

@QueryHandler(GetAttendanceQuery)
export class GetAttendanceHandler implements IQueryHandler<GetAttendanceQuery> {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
  ) {}
  async execute(query: GetAttendanceQuery): Promise<any> {
    const { user } = query;

    const filter = {
      $or: [{ teacher: user?._id }, { 'attendanceList.user': user?._id }],
      isActive: true,
    };

    let attendances = await this.attendanceModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate('teacher', 'fullName')
      .populate('class', 'title')
      .populate('attendanceList.user', 'fullName')
      .lean();

    attendances?.map((item) => {
      item.createdAt = item.createdAt?.toJalali();
    });

    let total: number = await this.attendanceModel.find(filter).count();

    return Response.send({ attendances, total });
  }
}
