import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { User } from 'src/schema/user.schema';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GlobalUtility } from 'src/utility/GlobalUtility';

export class GetExamsQuery {
  constructor(
    public readonly paging: PagingDto,
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetExamsQuery)
export class GetExamsHandler implements IQueryHandler<GetExamsQuery> {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
  ) {}
  async execute(query: GetExamsQuery): Promise<any> {
    const userId = query.user._id;
    const { department, semester } = query;
    const { eachPerPage, regex, skip } = GlobalUtility.pagingWrapper(
      query.paging,
    );

    let filter = {
      $or: [{ teacher: userId }, { students: { $in: [userId] } }],
      isActive: true,
      semester,
      department,
    };

    const exams: Array<Exam> = await this.examModel
      .find(filter)
      .limit(eachPerPage)
      .skip(skip)
      .sort({ date: -1 })
      .populate('students', 'fullName')
      .lean();

    const total: number = await this.examModel.find(filter).count();

    exams?.map((item) => {
      item.date = item?.date?.toJalali();
      item.createdAt = item?.createdAt?.toJalali();
    });

    return Response.send({
      list: exams,
      total,
    });
  }
}
