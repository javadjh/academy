import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Class, ClassDocument } from 'src/schema/class.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { userTypeEnum } from 'src/shareDTO/enums';

export class GetStudentsQuery {
  constructor(
    public readonly classId: string,
    public readonly department: string,
    public readonly semester: string,
  ) {}
}

@QueryHandler(GetStudentsQuery)
export class GetStudentsHandler implements IQueryHandler<GetStudentsQuery> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}
  async execute(query: GetStudentsQuery): Promise<any> {
    const { department, semester } = query;
    let classId = query.classId;
    if (classId) {
      let classItem = await this.classModel
        .findById(classId)
        .populate('students', 'fullName');

      let list = [];

      classItem?.students?.map((item) => {
        list.push({
          label: item.fullName,
          value: item?._id,
        });
      });

      return Response.send({ list });
    }

    const students = await this.userModel
      .find({ userType: userTypeEnum.student, department, semester })
      .select('fullName _id');

    let list = [];

    students?.map((item) => {
      list.push({
        label: item.fullName,
        value: item?._id,
      });
    });

    return Response.send({ list });
  }
}
