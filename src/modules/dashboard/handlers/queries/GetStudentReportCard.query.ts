import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { User } from 'src/schema/user.schema';

export class GetStudentReportCardQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetStudentReportCardQuery)
export class GetStudentReportCardHandler
  implements IQueryHandler<GetStudentReportCardQuery>
{
  constructor(@InjectModel(Exam.name) private examModel: Model<ExamDocument>) {}

  async execute(query: GetStudentReportCardQuery) {
    const student = query.user;
    const { department, semester } = query;

    // همه امتحانات که این دانش‌آموز حضور داشته (با نتیجه اگر ثبت شده)
    const exams = await this.examModel
      .find({ students: student._id, department, semester })
      .select('title date class resultes maxScore')
      .populate('class', 'title')
      .lean();

    exams?.map((item) => {
      item.date = item.date?.toJalali();
    });

    const report = exams.map((ex: any) => {
      const r = (ex.resultes || []).find(
        (x: any) => String(x.student) === String(student._id),
      );
      return {
        examId: ex._id,
        title: ex.title,
        class: ex.class,
        date: ex.date,
        score: r ? r.score : null,
        maxScore: ex.maxScore ?? null,
      };
    });

    // محاسبه میانگین
    const scores = report
      .map((r) => r.score)
      .filter((s) => typeof s === 'number');
    const avg = scores.length
      ? +(
          scores.reduce((a: number, b: number) => a + b, 0) / scores.length
        ).toFixed(2)
      : null;

    return Response.send({
      report,
      average: avg,
    });
  }
}
