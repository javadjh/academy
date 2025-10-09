import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';

export class GetStudentsListQuery {
  constructor(
    public readonly classId: string,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@QueryHandler(GetStudentsListQuery)
export class GetStudentsListHandler
  implements IQueryHandler<GetStudentsListQuery>
{
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}
  async execute(query: GetStudentsListQuery): Promise<any> {
    const { classId, department, semester } = query;
    console.log({ classId, department, semester });

    const classItem = await this.classModel.findOne({
      _id: classId,
      department,
      semester,
    });

    console.log(classItem);

    let students = classItem.students;

    return Response.send({ list: students });
  }
}
