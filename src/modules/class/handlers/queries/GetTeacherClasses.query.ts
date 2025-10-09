import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { User } from 'src/schema/user.schema';

export class GetTeacherClassesQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetTeacherClassesQuery)
export class GetTeacherClassesHandler
  implements IQueryHandler<GetTeacherClassesQuery>
{
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}
  formatScheduleTimes = (schedules: any[]): string => {
    if (!schedules || schedules.length === 0) {
      return 'زمان‌بندی برای این کلاس ثبت نشده است.';
    }

    // ایجاد لیستی از رشته‌های "روز هفته: ساعت"
    const formattedItems = schedules.map((item) => {
      // برای زیبایی بیشتر، اگر زمان تک رقمی است، صفر جلوی آن را حذف می‌کنیم (اختیاری)
      const displayTime = item.time.startsWith('0')
        ? item.time.substring(1)
        : item.time;
      return `🔸 ${item.dayWeek}، ساعت ${item.time}`;
    });

    // ترکیب آیتم‌ها با خط جدید و مقدمه
    const result = `📅 **زمان‌بندی کلاس:**\n${formattedItems.join('\n')}`;

    return result;
  };
  async execute(query: GetTeacherClassesQuery): Promise<any> {
    const { user, department, semester } = query;

    console.log(user);

    const classes: Array<Class> = await this.classModel
      .find({
        teacher: user?._id,
        semester,
        department,
      })
      .sort({ 'scheduleTimes.dayWeek': -1 })
      .populate('teacher', 'fullName')
      .populate('students', 'fullName')
      .lean();

    classes?.map((item) => {
      item.scheduleTimesFormated = this.formatScheduleTimes(item.scheduleTimes);
      item.createdAt = item.createdAt?.toJalali();
    });

    return Response.send({ list: classes });
  }
}
