import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { User, UserDocument } from 'src/schema/user.schema';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GlobalUtility } from 'src/utility/GlobalUtility';

export class GetAdminUsersQuery {
  constructor(public readonly paging: PagingDto) {}
}

@QueryHandler(GetAdminUsersQuery)
export class GetAdminUsersHandler implements IQueryHandler<GetAdminUsersQuery> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async execute(query: GetAdminUsersQuery): Promise<any> {
    const { eachPerPage, regex, skip } = GlobalUtility.pagingWrapper(
      query.paging,
    );

    const filter: any = {
      $or: [{ fullName: regex }],
    };

    const users: Array<User> = await this.userModel
      .find(filter)
      .limit(eachPerPage)
      .skip(skip)
      .select('-password')
      .lean();

    users?.map((item) => {
      item.createdAt = item.createdAt?.toJalali();
      item.updatedAt = item.updatedAt?.toJalali();
    });

    const total: number = await this.userModel.find(filter).count();

    return Response.send({
      users,
      total,
    });
  }
}
