import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { User, UserDocument } from 'src/schema/user.schema';
import { userTypeEnum } from 'src/shareDTO/enums';

export class GetTeachersQuery {
  constructor() {}
}

@QueryHandler(GetTeachersQuery)
export class GetTeachersHandler implements IQueryHandler<GetTeachersQuery> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async execute(query: GetTeachersQuery): Promise<any> {
    const teachers = await this.userModel
      .find({ userType: userTypeEnum.teacher })
      .select('fullName _id');

    let list = [];

    teachers?.map((item) => {
      list.push({
        label: item.fullName,
        value: item?._id,
      });
    });

    return Response.send({ list });
  }
}
