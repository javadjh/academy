import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginRequestDto } from '../../dto/request/LoginRequest.dto';
import { User, UserDocument } from 'src/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Password } from 'src/utility/password';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Auth } from 'src/config/Auth';
import { Response } from 'src/config/response';
import { Semester, SemesterDocument } from 'src/schema/semester.schema';

export class LoginQuery {
  constructor(public readonly dto: LoginRequestDto) {}
}

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Semester.name)
    private readonly semesterModel: Model<SemesterDocument>,

    private readonly auth: Auth,
  ) {}
  async execute(query: LoginQuery): Promise<any> {
    const { password, phoneNumber } = query.dto;

    const user: User = await this.userModel.findOne({
      phoneNumber,
    });

    if (!(await Password.compare(password, user.password)))
      throw new RecordNotFoundException();

    const semester = await this.semesterModel.findOne().sort({ createdAt: -1 });

    let token: string = await this.auth.generateToken({
      sub: user?._id,
      userType: user?.userType,
      semester: semester?._id,
      department: user.department,
    });

    return Response.send(token);
  }
}
