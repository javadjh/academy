import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Attendance, AttendanceDocument } from 'src/schema/attendance.schema';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GlobalUtility } from 'src/utility/GlobalUtility';

export class GetAdminAttendanceQuery {
  constructor(
    public readonly paging: PagingDto,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetAdminAttendanceQuery)
export class GetAdminAttendanceHandler
  implements IQueryHandler<GetAdminAttendanceQuery>
{
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
  ) {}
  async execute(query: GetAdminAttendanceQuery): Promise<any> {
    const { department, semester } = query;
    const { eachPerPage, skip } = GlobalUtility.pagingWrapper(query.paging);

    const attendances = await this.attendanceModel
      .find({ department, semester })
      .populate('teacher', 'fullName')
      .populate('class', 'title')
      .populate('attendanceList.user', 'fullName')
      .limit(eachPerPage)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    attendances?.map((item) => {
      item.createdAt = item.createdAt?.toJalali();
    });

    const total: number = await this.attendanceModel.find().count();

    return Response.send({
      list: attendances,
      total,
    });
  }
}
