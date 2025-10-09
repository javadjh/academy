import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { User } from 'src/schema/user.schema';

export class GetStudentScheduleQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetStudentScheduleQuery)
export class GetStudentScheduleHandler
  implements IQueryHandler<GetStudentScheduleQuery>
{
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async execute(query: GetStudentScheduleQuery) {
    const { department, semester } = query;
    const student = query.user;

    // برنامه هفتگی: همه کلاس‌هایی که دانش‌آموز عضو آنهاست
    const classes = await this.classModel
      .find({ students: student._id, isActive: true, department, semester })
      .select('title scheduleTimes teacher')
      .populate('teacher', 'fullName')
      .lean();

    // برنامه امتحانات (همه امتحانات مرتبط به دانش‌آموز)
    const exams = await this.examModel
      .find({ students: student._id, department, semester })
      .select('title date class teacher time resultes')
      .populate('class', 'title')
      .populate('teacher', 'fullName')
      .lean();

    exams?.map((item) => {
      item.date = item.date?.toJalali();
      console.log(student?._id);
      console.log(item.resultes);

      let itemResulte = item.resultes.filter(
        (ele) => ele.student == student?._id,
      );

      if (itemResulte?.length > 0) {
        item.resultesScore = itemResulte[0]?.score;
      }
      delete item.resultes;
    });
    // فرمت خروجی: گروه‌بندی بر اساس روز هفته برای نمایش هفتگی
    const scheduleByDay: Record<string, any[]> = {};
    classes.forEach((c: any) => {
      (c.scheduleTimes || []).forEach((s: any) => {
        const day = s.dayWeek || 'unknown';
        scheduleByDay[day] = scheduleByDay[day] || [];
        scheduleByDay[day].push({
          classId: c._id,
          title: c.title,
          time: s.time,
          teacher: c.teacher,
        });
      });
    });

    return Response.send({
      weeklySchedule: scheduleByDay,
      exams,
    });
  }
}
