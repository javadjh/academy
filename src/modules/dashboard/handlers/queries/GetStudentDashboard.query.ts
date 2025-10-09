import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { User } from 'src/schema/user.schema';

export class GetStudentDashboardQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetStudentDashboardQuery)
export class GetStudentDashboardHandler
  implements IQueryHandler<GetStudentDashboardQuery>
{
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async execute(query: GetStudentDashboardQuery) {
    const { department, semester } = query;
    const user = query.user;

    // کلاس‌های دانش‌آموز (فعال) — مرتب شده بر حسب نزدیک‌ترین روز
    const classes = await this.classModel
      .find({ students: user._id, isActive: true, department, semester })
      .select('title scheduleTimes teacher')
      .populate('teacher', 'fullName')
      .lean();

    // امتحانات آینده برای این دانش‌آموز
    const now = new Date();
    const upcomingExams = await this.examModel
      .find({ students: user._id, date: { $gte: now }, department, semester })
      .select('title date class teacher resultes')
      .populate('class', 'title')
      .populate('teacher', 'fullName')
      .lean();

    upcomingExams?.map((item) => {
      item.date = item.date?.toJalali();
    });

    // میانگین نمرات (از نتایج ثبت شده در exam.resultes)
    const examsWithScore = await this.examModel
      .find({ 'resultes.student': user._id, department, semester })
      .select('resultes.score')
      .lean();

    let total = 0,
      count = 0;
    examsWithScore.forEach((ex: any) => {
      ex.resultes?.forEach((r: any) => {
        if (
          String(r.student) === String(user._id) &&
          typeof r.score === 'number'
        ) {
          total += r.score;
          count += 1;
        }
      });
    });
    const average = count ? +(total / count).toFixed(2) : null;

    return Response.send({
      summary: {
        classesCount: classes.length,
        upcomingExamsCount: upcomingExams.length,
        averageScore: average,
      },
      classes,
      upcomingExams,
    });
  }
}
