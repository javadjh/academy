import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Exam, ExamDocument } from 'src/schema/exam.schema';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GlobalUtility } from 'src/utility/GlobalUtility';

export class GetAdminExamsQuery {
  constructor(
    public readonly paging: PagingDto,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetAdminExamsQuery)
export class GetAdminExamsHandler implements IQueryHandler<GetAdminExamsQuery> {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<ExamDocument>,
  ) {}
  async execute(query: GetAdminExamsQuery): Promise<any> {
    const { eachPerPage, regex, skip } = GlobalUtility.pagingWrapper(
      query.paging,
    );
    const { department, semester } = query;

    let filter = {
      $or: [{ title: regex }],
      isActive: true,
      semester,
      department,
    };

    const exams: Array<Exam> = await this.examModel
      .find(filter)
      .limit(eachPerPage)
      .skip(skip)
      .sort({ date: -1 })
      .populate('teacher', 'fullName')
      .populate('class', 'title')
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
