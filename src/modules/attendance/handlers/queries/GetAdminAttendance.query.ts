import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Attendance, AttendanceDocument } from 'src/schema/Attendance.schema';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GlobalUtility } from 'src/utility/GlobalUtility';

export class GetAdminAttendanceQuery {
  constructor(public readonly paging: PagingDto) {}
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
    const { eachPerPage, skip } = GlobalUtility.pagingWrapper(query.paging);

    const attendances = await this.attendanceModel
      .find()
      .populate('teacher', 'fullName')
      .populate('class', 'title')
      .populate('attendanceList.user', 'fullName')
      .limit(eachPerPage)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total: number = await this.attendanceModel.find().count();

    return Response.send({
      attendances,
      total,
    });
  }
}
