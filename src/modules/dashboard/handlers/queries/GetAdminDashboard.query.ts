import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { User, UserDocument } from 'src/schema/user.schema';

export class GetAdminDashboardQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetAdminDashboardQuery)
export class GetAdminDashboardHandler
  implements IQueryHandler<GetAdminDashboardQuery>
{
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async execute(query: GetAdminDashboardQuery): Promise<any> {
    const { department, semester } = query;
    const studentsCount = await this.userModel.countDocuments({
      userType: 'student',
      semester,
      department,
    });
    const teachersCount = await this.userModel.countDocuments({
      userType: 'teacher',
      semester,
      department,
    });
    const classesCount = await this.classModel.countDocuments({
      semester,
      department,
    });
    const examsCount = await this.examModel.countDocuments({
      semester,
      department,
    });

    // میانگین کلی نمرات (aggregate)
    const agg = await this.examModel.aggregate([
      { $unwind: { path: '$resultes', preserveNullAndEmptyArrays: false } },
      { $group: { _id: null, avgScore: { $avg: '$resultes.score' } } },
    ]);
    const averageScore = agg[0]?.avgScore ? +agg[0].avgScore.toFixed(2) : null;

    return Response.send({
      summary: {
        studentsCount,
        teachersCount,
        classesCount,
        examsCount,
        averageScore,
      },
    });
  }
}
