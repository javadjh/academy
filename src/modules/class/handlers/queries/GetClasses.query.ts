import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { User } from 'src/schema/user.schema';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GlobalUtility } from 'src/utility/GlobalUtility';

export class GetClassesQuery {
  constructor(public readonly paging: PagingDto) {}
}

@QueryHandler(GetClassesQuery)
export class GetClassesHandler implements IQueryHandler<GetClassesQuery> {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}
  async execute(query: GetClassesQuery): Promise<any> {
    const { eachPerPage, regex, skip } = GlobalUtility.pagingWrapper(
      query.paging,
    );

    let filter = {
      $or: [{ title: regex }],
    };

    const classes: Array<Class> = await this.classModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(eachPerPage)
      .lean();

    const total: number = await this.classModel.find(filter).count();

    return Response.send({
      classes,
      total,
    });
  }
}
