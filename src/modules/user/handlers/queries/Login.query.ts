import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginRequestDto } from '../../dto/request/LoginRequest.dto';
import { User, UserDocument } from 'src/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Password } from 'src/utility/password';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Auth } from 'src/config/Auth';
import { Response } from 'src/config/response';

export class LoginQuery {
  constructor(public readonly dto: LoginRequestDto) {}
}

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

    private readonly auth: Auth,
  ) {}
  async execute(query: LoginQuery): Promise<any> {
    const { password, phoneNumber } = query.dto;

    const user: User = await this.userModel.findOne({
      phoneNumber,
    });

    if (!(await Password.compare(password, user.password)))
      throw new RecordNotFoundException();

    let token: string = await this.auth.generateToken({
      sub: user?._id,
      userType: user?.userType,
    });

    return Response.send(token);
  }
}
