import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InsertAdminUserRequestDto } from '../../dto/request/InsertAdminUserRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { Password } from 'src/utility/password';
import passport from 'passport';
import { InsertException } from 'src/filters/insertException.filter';
import { Response } from 'src/config/response';
import { RecordRepeatedException } from 'src/filters/record-repeated.filter';

export class InsertAdminUserCommand {
  constructor(
    public readonly dto: InsertAdminUserRequestDto,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(InsertAdminUserCommand)
export class InsertAdminUserHandler
  implements ICommandHandler<InsertAdminUserCommand>
{
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async execute(command: InsertAdminUserCommand): Promise<any> {
    const { dto, department, semester } = command;

    const userFound = await this.userModel.findOne({
      phoneNumber: dto.phoneNumber,
    });
    if (userFound?._id) throw new RecordRepeatedException();

    dto.password = await Password.generate(dto.password);

    const user: User = await new this.userModel({
      ...dto,
      ...{
        fullName: `${dto.firstName} ${dto?.lastName}`,
        semester,
        department,
      },
    }).save();

    if (!user?._id) throw new InsertException();

    return Response.inserted();
  }
}
