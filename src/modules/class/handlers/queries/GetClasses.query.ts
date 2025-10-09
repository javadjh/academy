import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { User } from 'src/schema/user.schema';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GlobalUtility } from 'src/utility/GlobalUtility';

export class GetClassesQuery {
  constructor(
    public readonly paging: PagingDto,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetClassesQuery)
export class GetClassesHandler implements IQueryHandler<GetClassesQuery> {
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
  async execute(query: GetClassesQuery): Promise<any> {
    const { department, semester } = query;
    const { eachPerPage, regex, skip } = GlobalUtility.pagingWrapper(
      query.paging,
    );

    let filter = {
      $or: [{ title: regex }],
      isActive: true,
      semester,
      department,
    };

    const classes: Array<Class> = await this.classModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(eachPerPage)
      .populate('teacher', 'fullName')
      .lean();

    classes?.map((item) => {
      item.scheduleTimesFormated = this.formatScheduleTimes(item.scheduleTimes);
      item.createdAt = item.createdAt?.toJalali();
    });

    const total: number = await this.classModel.find(filter).count();

    return Response.send({
      list: classes,
      total,
    });
  }
}
