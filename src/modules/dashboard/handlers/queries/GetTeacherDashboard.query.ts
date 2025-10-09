import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { User } from 'src/schema/user.schema';

export class GetTeacherDashboardQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetTeacherDashboardQuery)
export class GetTeacherDashboardHandler
  implements IQueryHandler<GetTeacherDashboardQuery>
{
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async execute(query: GetTeacherDashboardQuery) {
    const { department, semester } = query;
    const teacher = query.user;

    // کلاس‌های این معلم
    const classes = await this.classModel
      .find({ teacher: teacher._id, isActive: true, department, semester })
      .select('title scheduleTimes students')
      .populate('students', 'fullName')
      .lean();

    // امتحانات مرتبط با این معلم (آینده و گذشته) — و استخراج مواردی که هنوز نتیجه کامل ثبت نشده
    const exams = await this.examModel
      .find({ teacher: teacher._id, department, semester })
      .select('title date class resultes students time')
      .populate('class', 'title')
      .lean();

    exams?.map((item) => {
      item.date = item.date?.toJalali();
    });

    const examsNeedingGrading = exams.filter((ex: any) => {
      // اگر برای حداقل یک دانش‌آموز در exam.resultes نمره خالی باشه یعنی نیاز به ثبت داره
      if (!ex.resultes || !ex.students) return false;
      const gradedCount = ex.resultes.filter(
        (r: any) => typeof r.score === 'number',
      ).length;
      return gradedCount < (ex.students?.length ?? 0);
    });

    const totalStudents = classes.reduce(
      (s: number, c: any) => s + (c.students?.length ?? 0),
      0,
    );

    return Response.send({
      summary: {
        classesCount: classes.length,
        totalStudents,
        examsCount: exams.length,
        examsToGrade: examsNeedingGrading.length,
      },
      classes,
      exams,
      examsNeedingGrading,
    });
  }
}
