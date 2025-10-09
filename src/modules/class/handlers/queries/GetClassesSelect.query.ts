import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { User } from 'src/schema/user.schema';
import { userTypeEnum } from 'src/shareDTO/enums';

export class GetClassesSelectQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetClassesSelectQuery)
export class GetClassesSelectHandler
  implements IQueryHandler<GetClassesSelectQuery>
{
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}

  async execute(query: GetClassesSelectQuery): Promise<any> {
    const { user, department, semester } = query;
    let filter = {
      isActive: true,
      department,
      semester,
    };

    if (user?.userType == userTypeEnum.teacher) {
      filter = { ...filter, ...{ teacher: user?._id } };
    }

    if (user?.userType == userTypeEnum.student) {
      filter = { ...filter, ...{ students: { $in: [user?._id] } } };
    }

    const classes: Array<Class> = await this.classModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    let list: any = [];

    classes?.map((item) => {
      list.push({
        value: item?._id,
        label: item?.title,
      });
    });

    return Response.send({
      list,
    });
  }
}
