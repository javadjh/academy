import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { User } from 'src/schema/user.schema';

export class GetTeacherScheduleQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetTeacherScheduleQuery)
export class GetTeacherScheduleHandler
  implements IQueryHandler<GetTeacherScheduleQuery>
{
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async execute(query: GetTeacherScheduleQuery) {
    const teacher = query.user;
    const { department, semester } = query;

    // کلاس‌های این معلم
    const classes = await this.classModel
      .find({ teacher: teacher._id, isActive: true, department, semester })
      .select('title scheduleTimes students')
      .populate('students', 'fullName')
      .lean();

    // امتحانات این معلم
    const exams = await this.examModel
      .find({ teacher: teacher._id, department, semester })
      .select('title date class students resultes')
      .populate('class', 'title')
      .lean();

    exams?.map((item) => {
      item.date = item.date?.toJalalai();
    });

    // جدا کردن امتحاناتی که هنوز برایشان کامل نمره ثبت نشده
    const pendingResults = exams.filter((ex: any) => {
      const graded = (ex.resultes || []).filter(
        (r: any) => typeof r.score === 'number',
      ).length;
      return graded < (ex.students?.length ?? 0);
    });

    // گروه‌بندی هفتگی مشابه دانش‌آموز اما با لیست دانش‌آموزان
    const scheduleByDay: Record<string, any[]> = {};
    classes.forEach((c: any) => {
      (c.scheduleTimes || []).forEach((s: any) => {
        const day = s.dayWeek || 'unknown';
        scheduleByDay[day] = scheduleByDay[day] || [];
        scheduleByDay[day].push({
          classId: c._id,
          title: c.title,
          time: s.time,
          studentsCount: c.students?.length ?? 0,
        });
      });
    });

    return Response.send({
      classes,
      scheduleByDay,
      exams,
      pendingResults,
    });
  }
}
