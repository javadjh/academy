import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { ClassGroup, ClassGroupDocument } from 'src/schema/class-group.schema';

export class GetClassGroupsQuery {}

@QueryHandler(GetClassGroupsQuery)
export class GetClassGroupsHandler
  implements IQueryHandler<GetClassGroupsQuery>
{
  constructor(
    @InjectModel(ClassGroup.name)
    private readonly classGroupModel: Model<ClassGroupDocument>,
  ) {}
  async execute(query: GetClassGroupsQuery): Promise<any> {
    const classGroups = await this.classGroupModel.find().lean();
    const total = await this.classGroupModel.find().count();

    let list = [];
    classGroups.map((item) => {
      list.push({
        ...item,
        label: item.title,
        value: item?._id,
      });
    });

    return Response.send({
      list,
      total,
    });
  }
}
