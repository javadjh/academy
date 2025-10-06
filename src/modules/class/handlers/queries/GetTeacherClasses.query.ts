import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { User } from 'src/schema/user.schema';

export class GetTeacherClassesQuery {
  constructor(public readonly user: User) {}
}

@QueryHandler(GetTeacherClassesQuery)
export class GetTeacherClassesHandler
  implements IQueryHandler<GetTeacherClassesQuery>
{
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}
  async execute(query: GetTeacherClassesQuery): Promise<any> {
    const { user } = query;

    const classes: Array<Class> = await this.classModel
      .find({
        teacher: user?._id,
      })
      .sort({ 'scheduleTimes.dayWeek': -1 })
      .populate('students', 'fullName');

    return Response.send(classes);
  }
}
