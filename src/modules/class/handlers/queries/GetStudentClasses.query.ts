import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { User } from 'src/schema/user.schema';

export class GetStudentClassesQuery {
  constructor(
    public readonly user: User,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetStudentClassesQuery)
export class GetStudentClassesHandler
  implements IQueryHandler<GetStudentClassesQuery>
{
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}
  async execute(query: GetStudentClassesQuery): Promise<any> {
    const { user, department, semester } = query;

    const classes: Array<Class> = await this.classModel
      .find({
        semester,
        department,
        students: {
          $in: [user?._id],
        },
      })
      .sort({ 'scheduleTimes.dayWeek': -1 })
      .populate('teacher', 'fullName');

    return Response.send(classes);
  }
}
