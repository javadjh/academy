import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { User, UserDocument } from 'src/schema/user.schema';

export class GetAdminProgressQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetAdminProgressQuery)
export class GetAdminProgressHandler
  implements IQueryHandler<GetAdminProgressQuery>
{
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async execute(query: GetAdminProgressQuery): Promise<any> {
    const { department, semester } = query;

    // محاسبه میانگین نمره برای هر دانش‌آموز با استفاده از aggregation
    const agg = await this.examModel.aggregate([
      { $unwind: '$resultes' },
      {
        $group: {
          _id: '$resultes.student',
          avgScore: { $avg: '$resultes.score' },
          examsCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          studentId: '$_id',
          avgScore: 1,
          examsCount: 1,
          'student.fullName': 1,
          'student.phoneNumber': 1,
        },
      },
      { $sort: { avgScore: -1 } },
    ]);

    // بازگرداندن لیست خلاصه‌شده
    const list = agg.map((it: any) => ({
      studentId: it.studentId,
      fullName: it.student?.fullName ?? null,
      phoneNumber: it.student?.phoneNumber ?? null,
      avgScore: it.avgScore ? +it.avgScore.toFixed(2) : null,
      examsCount: it.examsCount,
    }));

    return Response.send({ list });
  }
}
