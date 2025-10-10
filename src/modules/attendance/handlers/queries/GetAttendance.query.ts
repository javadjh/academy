import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Attendance, AttendanceDocument } from 'src/schema/attendance.schema';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { User } from 'src/schema/user.schema';
import { userTypeEnum } from 'src/shareDTO/enums';

export class GetAttendanceQuery {
  constructor(
    public readonly user: User,
    public readonly classId: string,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetAttendanceQuery)
export class GetAttendanceHandler implements IQueryHandler<GetAttendanceQuery> {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,

    @InjectModel(Class.name)
    private readonly classModel: Model<ClassDocument>,
  ) {}
  async execute(query: GetAttendanceQuery): Promise<any> {
    const { user, classId, department, semester } = query;

    const filter = {
      $or: [{ teacher: user?._id }, { 'attendanceList.user': user?._id }],
      // isActive: true,
      class: classId,
      department,
      semester,
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

    const classItem: Class | null = await this.classModel
      .findOne({
        _id: classId,
      })
      .populate('students', 'fullName');

    let total: number = await this.attendanceModel.find(filter).count();

    return Response.send({ list: attendances, total, classItem });
  }
}
